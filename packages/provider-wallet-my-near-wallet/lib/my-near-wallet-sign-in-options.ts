import { WalletConnectOptions } from '@near.js/provider-core';

export interface MyNearWalletSignInOptions extends WalletConnectOptions {
  contract?: string;

  methods?: string[];

  callbackUrl?: string;
}
