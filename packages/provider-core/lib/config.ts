import { KeyStore } from '@nearjs/account';

// TODO: add auth options

export type RPCProviderHeadersConfig = { [key: string]: string | number };

export enum StandardNodeUrls {
  TESTNET = 'https://rpc.testnet.near.org',
}

// TODO: should it be just an interface ?
export interface RPCProviderConfig {
  rpcUrl: string;
  networkId?: string; // TODO: enum or custom
  allowInsecure?: boolean;
  timeout?: number;
  headers?: RPCProviderHeadersConfig;

  keyStore: KeyStore;
}
