import { KeyStore } from '@nearjs/account';
import { getRPCConfig, Network, RPCProviderConfig } from '@nearjs/provider-core';

export interface MyNearWalletConfiguration extends RPCProviderConfig {
  walletBaseUrl: string;
  blockPopupFallback?: boolean;
  window?: Window;
}

export { Network } from '@nearjs/provider-core';

export const getConfiguration = (networkId: Network, keyStore: KeyStore): MyNearWalletConfiguration => {
  const walletBaseUrl = networkId === Network.TESTNET
    ? 'https://testnet.mynearwallet.com'
    : 'https://app.mynearwallet.com';

  return { ...getRPCConfig(networkId, keyStore), window, walletBaseUrl };
};
