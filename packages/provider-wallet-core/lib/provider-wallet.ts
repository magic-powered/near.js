import {
  NearRPCProvider,
  BroadcastTxSyncResult,
  RPCProviderConfig,
  RPCRequest,
  RPCResponse,
} from '@near.js/provider-core';
import { IAction } from '@near.js/tx';

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

export abstract class ProviderWallet<Configuration extends RPCProviderConfig>
  extends NearRPCProvider<Configuration> {
  public abstract connectAccount<SignInOptions extends WalletConnectOptions>(
    options: SignInOptions
  ): Promise<void>; // TODO: void?

  public abstract listConnectedAccounts(): Promise<string[]>; // TODO: AccountId type?

  public abstract isAccountConnected(accountId: string): Promise<boolean>;

  public abstract viewAccount(accountId: string): Promise<AccountView>; // TODO: is it necessary?

  public abstract sendTransactionSync(
    accountId: string,
    receiverId: string,
    actions: IAction[],
  ): Promise<RPCResponse<BroadcastTxSyncResult>>;

  public abstract signAndSend<RequestType extends RPCRequest>(
    rpcRequest: RequestType
  ): Promise<RPCResponse<RequestType>>;

  public abstract sendViewRequest<RequestType extends RPCRequest>(
    rpcRequest: RequestType
  ): Promise<RPCResponse<RequestType>>;
}
