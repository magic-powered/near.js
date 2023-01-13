import { KeyStore } from '@near.js/account';
import { RPCProviderConfig } from '@near.js/provider-core';

export interface MyNearWalletConfiguration extends RPCProviderConfig {
  keyStore: KeyStore;
  walletBaseUrl: string;
  throwIfInsufficientAllowance: boolean; // TODO: review this
  window: Window; // TODO: abstract handler that can use window object OR 'open' pkg
}
