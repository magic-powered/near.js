import { KeyStore } from '@nearjs/account';
import { RPCProviderConfig } from '@nearjs/provider-core';

export interface MyNearWalletConfiguration extends RPCProviderConfig {
  keyStore: KeyStore;
  walletBaseUrl: string;
  throwIfInsufficientAllowance: boolean; // TODO: review this
  window: Window; // TODO: abstract handler that can use window object OR 'open' pkg
}
