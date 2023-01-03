import {
  NearRPCProvider,
  RPCProviderConfig,
  RPCRequest,
  RPCResponse,
} from '@near.js/provider-core';

export interface WalletConnectOptions {
  contractId?: string;
  methodNames?: string[];
}

export interface AccountView { // TODO: move to @near.js/account?
  balance: string;
  blockHash: string;
  blockHeight: number;
  codeHash: string;
  locked: string;
  storagePaidAt: number;
  storageUsage: number;
}

export abstract class ProviderWalletCore<Configuration extends RPCProviderConfig>
  extends NearRPCProvider<Configuration> {
  public abstract connectAccount<SignInOptions extends WalletConnectOptions>(
    options: SignInOptions
  ): Promise<void>; // TODO: void?

  public abstract listConnectedAccounts(): Promise<string[]>; // TODO: AccountId type?

  public abstract isAccountConnected(accountId: string): Promise<boolean>;

  public abstract viewAccount(accountId: string): Promise<AccountView>;

  public abstract signAndSend<RequestType extends RPCRequest>(
    rpcRequest: RequestType
  ): Promise<RPCResponse<RequestType>>;

  public abstract sendViewRequest<RequestType extends RPCRequest>(
    rpcRequest: RequestType
  ): Promise<RPCResponse<RequestType>>;

  public abstract sign(accountId: string, message: Uint8Array): Promise<Uint8Array>;

  public abstract verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean>;

  public abstract getPublicKey(accountId: string): Promise<Uint8Array>;
}
