import axios from 'axios';

import { IProvider, TODO } from '@near.js/provider-core';
import { ISignedTransaction } from '@near.js/signer';

import { RPCProviderConfig } from "./config";
import { JsonRpcRequest, JsonRpcRequestBroadcastTx } from "./request";
import { IJsonRpcBroadcastTxResponse } from "./response";

export class RPCProvider implements IProvider {
  private readonly config: RPCProviderConfig;
  private requestId: number = 1;

  constructor(config: RPCProviderConfig) {
    this.config = config;
  }

  public async sendTx(transaction: ISignedTransaction): Promise<string> {
    const borsh = transaction.toBorsh();
    const request = new JsonRpcRequestBroadcastTx((this.requestId++), borsh.toString('base64'));
    const result = await this.sendPostRequest<IJsonRpcBroadcastTxResponse>(request);
    if (result.error) {
      // TODO: throw good error
      throw new Error(result.error.name);
    }

    return result.result;
  }

  private async sendPostRequest<ReturnType>(request: JsonRpcRequest): Promise<ReturnType> {
    return this.send<ReturnType>("POST", request);
  }

  private async sendGetRequest<ReturnType>(request: JsonRpcRequest): Promise<ReturnType> {
    return this.send<ReturnType>("GET", request);
  }

  private async send<ReturnType>(method: "POST" | "GET", request: JsonRpcRequest): Promise<ReturnType> {
    const result = await axios.request<ReturnType>({
      url: this.config.url,
      method,
      data: request.toObject(),
      timeout: this.config.timeout,
      headers: this.config.headers,
    });

    return result.data;
  }
}
