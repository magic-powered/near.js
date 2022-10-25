// @todo: add auth options

export type RPCProviderHeadersConfig = { [key: string]: string | number };

export enum StandardNodeUrls {
  TESTNET = 'https://rpc.testnet.near.org',
}

interface IRPCProviderConfig {
  readonly url: StandardNodeUrls | string;
  // @todo: enum?? we need to be able to extend it tho because we assume
  //        there are infinite possibilities to sping up new Near envs (like shardnet)
  readonly envLabel?: string;
  readonly allowInsecure?: boolean;
  readonly timeout?: number;
  readonly headers?: RPCProviderHeadersConfig;
}

export class RPCProviderConfig implements IRPCProviderConfig {
  public readonly url: string;

  // @todo: enum?? we need to be able to extend it tho because we assume
  //        there are infinite possibilities to sping up new Near envs (like shardnet)
  public readonly envLabel?: string;

  public readonly allowInsecure?: boolean;

  public readonly timeout?: number;

  public readonly headers?: RPCProviderHeadersConfig;

  constructor(
    url: string,
    envLabel?: string,
    allowInsecure?: boolean,
    timeout?: number,
    headers?: RPCProviderHeadersConfig,
  ) {
    this.url = url;
    this.envLabel = envLabel;
    this.allowInsecure = allowInsecure;
    this.timeout = timeout;
    this.headers = headers;
  }

  public static fromJSON(config: IRPCProviderConfig) {
    return new RPCProviderConfig(
      config.url,
      config.envLabel,
      config.allowInsecure,
      config.timeout,
      config.headers,
    );
  }
}
