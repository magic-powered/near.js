import {
  IAction, TransactionBuilder,
} from '@near.js/tx';
import {
  RPCResponse, RPCRequest, Block, BroadcastTxSync, BroadcastTxSyncResult,
} from '@near.js/provider-core';

// TODO: typings
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { base58_to_binary as fromBase58 } from 'base58-js';

import { ProviderMyNearWalletSigner } from './provider-my-near-wallet-signer';

export abstract class ProviderMyNearWalletTransactionSender extends ProviderMyNearWalletSigner {
  public async sendTransactionSync(
    accountId: string,
    receiverId: string,
    actions: IAction[],
  ): Promise<RPCResponse<BroadcastTxSyncResult>> {
    const keyPair = await this.getKeyPair(accountId);
    const block = await this.sendViewRequest(new Block('final'));

    const transaction = TransactionBuilder.builder()
      .withActions(actions)
      .withSignerId(accountId)
      .withReceiverId(receiverId)
      .withPublicKey(keyPair.getPublicKey())
      .withNonce(keyPair.getAndIncrementNonce())
      .withBlockHash(fromBase58(block.result.header.hash))
      .build();

    await this.persistKeyPair(accountId, keyPair);

    const signedTransaction = await this.signTransaction(accountId, transaction);

    const broadcastTxSync = new BroadcastTxSync(signedTransaction);

    try {
      return await this.signAndSend(broadcastTxSync);
    } catch (e) {
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
          && e.errorObject.data.TxExecutionError.InvalidTxError.InvalidNonce.ak_nonce
        ) {
          keyPair.setNonce(
            e.errorObject.data.TxExecutionError.InvalidTxError.InvalidNonce.ak_nonce,
          );
          await this.persistKeyPair(accountId, keyPair);

          // TODO: prevent infinite execution
          // TODO: do a exp. backoff
          return this.sendTransactionSync(accountId, receiverId, actions);
        }
      }

      throw e;
    }
  }

  public signAndSend<RequestType extends RPCRequest>(
    rpcRequest: RequestType,
  ): Promise<RPCResponse<RequestType>> {
    // TODO: define when we should open wallet
    return this.sendRPCRequest(rpcRequest);
  }

  public sendViewRequest<RequestType extends RPCRequest>(
    rpcRequest: RequestType,
  ): Promise<RPCResponse<RequestType>> {
    // TODO: define how we can separate view methods out from non-view methods
    return this.sendRPCRequest(rpcRequest);
  }
}
