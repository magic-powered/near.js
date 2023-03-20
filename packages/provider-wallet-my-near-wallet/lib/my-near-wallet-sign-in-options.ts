import { WalletConnectOptions } from '@nearjs/provider-core';

export interface MyNearWalletSignInOptions extends WalletConnectOptions {
  callbackUrl?: string;
}
