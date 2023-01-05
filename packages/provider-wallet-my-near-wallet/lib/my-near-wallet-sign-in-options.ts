import { WalletConnectOptions } from '@near.js/provider-wallet-core';

export interface MyNearWalletSignInOptions extends WalletConnectOptions {
  contract?: string;

  methods?: string[];

  callbackUrl?: string;
}
