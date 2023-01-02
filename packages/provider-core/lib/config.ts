// TODO: add auth options

export type RPCProviderHeadersConfig = { [key: string]: string | number };

export enum StandardNodeUrls {
  TESTNET = 'https://rpc.testnet.near.org',
}

// TODO: should it be just an interface ?
export class RPCProviderConfig {
  public readonly url: string;

  // TODO: enum?? we need to be able to extend it tho because we assume
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

  public static fromJSON(jsonString: string): RPCProviderConfig {
    const config = JSON.parse(jsonString);

    return new RPCProviderConfig(
      config.url,
      config.envLabel,
      config.allowInsecure,
      config.timeout,
      config.headers,
    );
  }
}
