import { WalletConnectOptions } from '@nearjs/provider-core';

export interface MyNearWalletSignInOptions extends WalletConnectOptions {
  contract?: string;

  methods?: string[];

  callbackUrl?: string;
}
