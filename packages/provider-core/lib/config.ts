import { KeyStore } from '@nearjs/account';

// TODO: add auth options

export type RPCProviderHeadersConfig = { [key: string]: string | number };

export enum Network {
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
  BETANET = 'betanet',
  LOCALNET = 'localnet',
  CUSTOM = 'custom',
}

export interface RPCProviderConfig {
  rpcUrl: string;
  networkId: Network;
  allowInsecure?: boolean;
  timeout?: number;
  headers?: RPCProviderHeadersConfig;
  keyStore?: KeyStore;
}

export const networkUrls = {
  [Network.MAINNET]: 'https://rpc.mainnet.near.org',
  [Network.TESTNET]: 'https://rpc.testnet.near.org',
  [Network.BETANET]: 'https://rpc.betanet.near.org',
  [Network.LOCALNET]: 'http://localhost:3030',
};

export const getRPCConfig = (networkId: Network, keyStore?: KeyStore): RPCProviderConfig => {
  if (networkId === Network.CUSTOM) {
    throw new Error('getRPCConfig support only predefined RPCs. Please build RPCProviderConfig for your env manually');
  }

  if (!networkUrls[networkId]) {
    throw new Error(`network ${networkId} is not default, please construct custom RPCProviderConfig`);
  }

  return {
    networkId,
    rpcUrl: networkUrls[networkId],
    keyStore,
  };
};

export const mainnetRPCConfig = (keyStore?: KeyStore): RPCProviderConfig => getRPCConfig(Network.MAINNET, keyStore);

export const testnetRPCConfig = (keyStore?: KeyStore): RPCProviderConfig => getRPCConfig(Network.TESTNET, keyStore);

export const betanetRPCConfig = (keyStore?: KeyStore): RPCProviderConfig => getRPCConfig(Network.BETANET, keyStore);

export const localnetRPCConfig = (keyStore?: KeyStore): RPCProviderConfig => getRPCConfig(Network.LOCALNET, keyStore);
