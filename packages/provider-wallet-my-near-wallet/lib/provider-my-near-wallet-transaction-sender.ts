import { RPCResponse, RPCRequest } from '@near.js/provider-core';

import { ProviderMyNearWalletSigner } from './provider-my-near-wallet-signer';

export abstract class ProviderMyNearWalletTransactionSender extends ProviderMyNearWalletSigner {
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
