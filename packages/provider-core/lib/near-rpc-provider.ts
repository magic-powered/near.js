import {
  PublicKey, KeyId, KeyPair, FullAccess, FunctionCallPermission, AccessKey,
} from '@nearjs/account';
import {
  Transaction,
  SignedTransaction,
  IAction,
  TransactionBuilder,
} from '@nearjs/tx';
// TODO: custom typings needed
// @ts-ignore
import { base58_to_binary as fromBase58 } from 'base58-js';
import { JsonRPCRequest, RPCRequest } from './request';
import { IJsonRpcResponse, RPCResponse } from './response';
import { RPCProviderConfig } from './config';
import { RPCError, UnknownError } from './errors';
import { Block, BroadcastTxSync, ViewAccessKey } from './requests';
import { CallViewFunction } from './requests/call-view-function';

export enum HTTPMethods {
  POST = 'POST',
  GET = 'GET',
}

export interface WalletConnectOptions {
  contractId?: string;
  methodNames?: string[];
  fullAccess?: boolean;
}

export class NearRPCProvider<
  ProviderConfig extends RPCProviderConfig,
> {
  protected requestId = 1;

  protected readonly config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  public getNetworkId() {
    return this.config.networkId;
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

  public async getPublicKey(accountId: string): Promise<PublicKey | null> {
    const keyPair = await this.getKeyPair(accountId);

    if (!keyPair) {
      return null;
    }

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
    if (!this.config.keyStore) {
      throw new Error('No KeyStore was provided.');
    }
    const keyId = new KeyId(accountId, this.config.networkId);
    return this.config.keyStore.getKeyPairByKeyId(keyId);
  }

  protected async persistKeyPair(accountId: string, keyPair: KeyPair) {
    if (!this.config.keyStore) {
      throw new Error('No KeyStore was provided.');
    }
    const keyId = new KeyId(accountId, this.config.networkId);
    await this.config.keyStore.addKeyByKeyId(keyId, keyPair);
  }

  public async listConnectedAccounts(): Promise<string[]> {
    if (!this.config.keyStore) {
      throw new Error('No KeyStore was provided.');
    }
    const keyIdStrings = await this.config.keyStore.listKeys();
    return keyIdStrings.map(KeyId.extractAccountId);
  }

  public async isAccountConnected(accountId: string): Promise<boolean> {
    const connectedAccounts = await this.listConnectedAccounts();

    return connectedAccounts.includes(accountId);
  }

  public async fetchAccessKey(accountId: string, tryCount = 1): Promise<void> {
    const keyPair = await this.getKeyPair(accountId);
    if (!keyPair) {
      throw new Error(`Cannot fetch access key for account ${accountId} because no keypair found for the account`);
    }

    const accessKeyResponse = await this.sendRPCRequest(new ViewAccessKey(accountId, keyPair.getPublicKey()));

    if (accessKeyResponse.result.error) {
      if (tryCount > 2) {
        return;
      }

      await (new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          this.fetchAccessKey(accountId, tryCount).then(resolve).catch(reject);
        }, 1000);
      }));

      return;
    }

    const accessKeyPermission = accessKeyResponse.result.permission === 'FullAccess'
      ? new FullAccess()
      : new FunctionCallPermission(
        accessKeyResponse.result.permission.FunctionCall.allowance,
        accessKeyResponse.result.permission.FunctionCall.receiver_id,
        accessKeyResponse.result.permission.FunctionCall.method_names,
      );
    const accessKey = new AccessKey(accessKeyResponse.result.nonce, accessKeyPermission);

    keyPair.setAccessKey(accessKey);

    await this.persistKeyPair(accountId, keyPair);
  }

  protected async buildTransaction(
    senderAccountId: string,
    receiverAccountId: string,
    actions: IAction[],
  ): Promise<Transaction> {
    const keyPair = await this.getKeyPair(senderAccountId);

    const block = await this.sendRPCRequest(new Block('final'));

    const tx = TransactionBuilder.builder()
      .withActions(actions)
      .withSignerId(senderAccountId)
      .withReceiverId(receiverAccountId)
      .withPublicKey(keyPair.getPublicKey())
      .withNonce(keyPair.getAndIncrementNonce())
      .withBlockHash(fromBase58(block.result.header.hash))
      .build();

    await this.persistKeyPair(senderAccountId, keyPair);

    return tx;
  }

  public async sendTransactionSync(
    senderAccountId: string,
    receiverAccountId: string,
    actions: IAction[],
    retryCount = 0,
  ): Promise<RPCResponse<BroadcastTxSync>> {
    const transaction = await this.buildTransaction(senderAccountId, receiverAccountId, actions);

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
      // TODO: typings for errors
      if (
        e
        && (e as any).errorObject
        && (e as any).errorObject.cause
        && (e as any).errorObject.cause.name === 'INVALID_TRANSACTION'
      ) {
        if (
          (e as any).errorObject.data
          && (e as any).errorObject.data.TxExecutionError
          && (e as any).errorObject.data.TxExecutionError.InvalidTxError
          && (e as any).errorObject.data.TxExecutionError.InvalidTxError.InvalidNonce
          && (e as any).errorObject.data.TxExecutionError.InvalidTxError.InvalidNonce
            .ak_nonce
        ) {
          const keyPair = await this.getKeyPair(senderAccountId);

          keyPair.setNonce(
            (e as any).errorObject.data.TxExecutionError.InvalidTxError.InvalidNonce
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
    const id = this.config.timeout
      ? setTimeout(() => controller.abort(), this.config.timeout) : null;

    const response = await fetch(this.config.rpcUrl, {
      method,
      body: JSON.stringify(request.toObject()),
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      signal: controller.signal,
    });

    if (id) {
      clearTimeout(id);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new UnknownError(result);
    }

    if (result.error) {
      throw new RPCError(result.error);
    }

    return result;
  }
}
