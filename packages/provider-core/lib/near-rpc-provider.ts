// TODO: remove nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { PublicKey, KeyId, KeyPair } from '@near.js/account';
import {
  Transaction,
  SignedTransaction,
  IAction,
  TransactionBuilder,
} from '@near.js/tx';
// TODO: typings
import { base58_to_binary as fromBase58 } from 'base58-js';
import { JsonRPCRequest, RPCRequest } from './request';
import { IJsonRpcResponse, RPCResponse } from './response';
import { RPCProviderConfig } from './config';
import { RPCError, UnknownError } from './errors';
import { Block, BroadcastTxSync } from './requests';
import { CallViewFunction } from './requests/call-view-function';

export enum HTTPMethods {
  POST = 'POST',
  GET = 'GET',
}

export interface WalletConnectOptions {
  contractId?: string;
  methodNames?: string[];
}

export abstract class NearRPCProvider<
  ProviderConfig extends RPCProviderConfig,
> {
  protected requestId = 1;

  protected readonly config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  public async sign(
    accountId: string,
    message: Uint8Array,
  ): Promise<Uint8Array> {
    const keyPair = await this.getKeyPair(accountId);

    return keyPair.sign(message);
  }

  // eslint-disable-next-line class-methods-use-this
  public async verify(
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: Uint8Array,
  ): Promise<boolean> {
    return KeyPair.verifyWithPublicKey(message, signature, publicKey);
  }

  public async getPublicKey(accountId: string): Promise<PublicKey> {
    const keyPair = await this.getKeyPair(accountId);

    return keyPair.getPublicKey();
  }

  public async signTransaction(
    accountId: string,
    transaction: Transaction,
  ): Promise<SignedTransaction> {
    const signature = await this.sign(accountId, transaction.getHash().data);
    return new SignedTransaction(transaction, signature);
  }

  protected async getKeyPair(accountId: string): Promise<KeyPair> {
    const keyId = new KeyId(accountId, this.config.networkId);
    return this.config.keyStore.getKeyPairByKeyId(keyId);
  }

  protected async persistKeyPair(accountId: string, keyPair: KeyPair) {
    const keyId = new KeyId(accountId, this.config.networkId);
    this.config.keyStore.addKeyByKeyId(keyId, keyPair);
  }

  public async listConnectedAccounts(): Promise<string[]> {
    const keyIdStrings = await this.config.keyStore.listKeys();
    return keyIdStrings.map(KeyId.extractAccountId);
  }

  public async isAccountConnected(accountId: string): Promise<boolean> {
    const connectedAccounts = await this.listConnectedAccounts();

    return connectedAccounts.includes(accountId);
  }

  public async sendTransactionSync(
    senderAccountId: string,
    receiverAccountId: string,
    actions: IAction[],
    retryCount = 0,
  ): Promise<RPCResponse<BroadcastTxSync>> {
    const keyPair = await this.getKeyPair(senderAccountId);
    const block = await this.sendRPCRequest(new Block('final'));

    const transaction = TransactionBuilder.builder()
      .withActions(actions)
      .withSignerId(senderAccountId)
      .withReceiverId(receiverAccountId)
      .withPublicKey(keyPair.getPublicKey())
      .withNonce(keyPair.getAndIncrementNonce())
      .withBlockHash(fromBase58(block.result.header.hash))
      .build();

    await this.persistKeyPair(senderAccountId, keyPair);

    const signedTransaction = await this.signTransaction(
      senderAccountId,
      transaction,
    );

    const broadcastTxSync = new BroadcastTxSync(signedTransaction);

    try {
      return await this.sendRPCRequest(broadcastTxSync);
    } catch (e) {
      if (retryCount > 2) {
        throw e;
      }
      // TODO: parse and wrap errors separately
      if (
        e
        && e.errorObject
        && e.errorObject.cause
        && e.errorObject.cause.name === 'INVALID_TRANSACTION'
      ) {
        if (
          e.errorObject.data
          && e.errorObject.data.TxExecutionError
          && e.errorObject.data.TxExecutionError.InvalidTxError
          && e.errorObject.data.TxExecutionError.InvalidTxError.InvalidNonce
          && e.errorObject.data.TxExecutionError.InvalidTxError.InvalidNonce
            .ak_nonce
        ) {
          keyPair.setNonce(
            e.errorObject.data.TxExecutionError.InvalidTxError.InvalidNonce
              .ak_nonce,
          );
          await this.persistKeyPair(senderAccountId, keyPair);

          // TODO: do a exp. backoff??
          return this.sendTransactionSync(
            senderAccountId,
            receiverAccountId,
            actions,
            retryCount + 1,
          );
        }
      }

      throw e;
    }
  }

  public async sendViewCall(
    targetAccountId: string,
    functionName: string,
    args: { [key: string]: any },
  ) {
    const request = new CallViewFunction(targetAccountId, functionName, args);
    const result = await this.sendRPCRequest(request);
    if (result.result.error) {
      throw new Error(result.result.error);
    }
    result.result.parsedResult = Buffer.from(result.result.result).toString();

    return result;
  }

  protected async sendRPCRequest<RequestType extends RPCRequest>(
    rpcRequest: RequestType,
    method: HTTPMethods = HTTPMethods.POST,
  ): Promise<RPCResponse<RequestType>> {
    this.requestId += 1;
    return this.sendJsonRpcRequest(
      rpcRequest.toJsonRPCRequest(this.requestId),
      method,
    );
  }

  protected async sendJsonRpcRequest<ReturnType>(
    request: JsonRPCRequest,
    method: HTTPMethods = HTTPMethods.POST,
  ): Promise<IJsonRpcResponse<ReturnType>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.config.timeout);

    const response = await fetch(this.config.rpcUrl, {
      method,
      body: JSON.stringify(request.toObject()),
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(id);

    const result = await response.json();

    if (result.status !== 200) {
      throw new UnknownError(result.data);
    }

    if (result.data.error) {
      throw new RPCError(result.data.error);
    }

    return result.data;
  }
}
