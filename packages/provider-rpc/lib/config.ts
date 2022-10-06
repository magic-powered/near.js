// TODO: add auth options

export type RPCProviderHeadersConfig = { [key: string]: string | number };

export class RPCProviderConfig {
  public readonly url: string;
  public readonly envLabel?: string; // TODO: enum?? we need to be able to extend it tho because we assume there are infinite possibilities to sping up new Near envs (like shardnet)
  public readonly allowInsecure?: boolean;
  public readonly timeout?: number;
  public readonly headers?: RPCProviderHeadersConfig;

  constructor(url: string, envLabel?: string, allowInsecure?: boolean, timeout?: number, headers?: RPCProviderHeadersConfig) {
    this.url = url;
    this.envLabel = envLabel;
    this.allowInsecure = allowInsecure;
    this.timeout = timeout;
    this.headers = headers;
  }

}
