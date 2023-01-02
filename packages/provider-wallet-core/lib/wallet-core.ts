import { KeyStore } from '@near.js/account';
import { NearRPCProvider, RPCProviderConfig } from '@near.js/provider-core';

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

export class WalletProviderConfiguration extends RPCProviderConfig {
  keyStore: KeyStore;
}

export abstract class WalletCore extends NearRPCProvider<WalletProviderConfiguration> {
  public abstract connectAccount<SignInOptions extends WalletConnectOptions>(
    options: SignInOptions
  ): Promise<void>; // TODO: void?

  public abstract listConnectedAccounts(): Promise<string[]>; // TODO: AccountId type?

  public abstract isAccountConnected(accountId: string): Promise<boolean>;

  public abstract viewAccount(accountId: string): Promise<AccountView>;
}
