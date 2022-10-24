import axios from 'axios';

import { IProvider } from '@near.js/provider-core';

import { RPCProviderConfig } from "./config";
import { JsonRPCRequest, IJsonRPCRequest, RPCRequest } from "./request";
import { RPCError, UnknownError } from "./errors";
import { IJsonRpcResponse, RPCResponse } from "./response";

export enum HTTPMethods {
  POST = "POST",
  GET = "GET",
}

export class RPCProvider implements IProvider {
  private readonly config: RPCProviderConfig;
  private requestId: number = 1;

  constructor(config: RPCProviderConfig) {
    this.config = config;
  }

  public async sendRawRequest<ReturnType>(requestObject: IJsonRPCRequest, method: HTTPMethods = HTTPMethods.POST): Promise<IJsonRpcResponse<ReturnType>> {
    return this.sendJsonRpcRequest<ReturnType>(JsonRPCRequest.fromObject((this.requestId++), requestObject), method);
  }

  public async sendRPCRequest<RequestType extends RPCRequest>(rpcRequest: RequestType, method: HTTPMethods = HTTPMethods.POST): Promise<RPCResponse<RequestType>> {
    return this.sendJsonRpcRequest(rpcRequest.toJsonRPCRequest((this.requestId++)), method);
  }

  private async sendJsonRpcRequest<ReturnType>(request: JsonRPCRequest, method: HTTPMethods = HTTPMethods.POST): Promise<IJsonRpcResponse<ReturnType>> {
    const result = await axios.request<IJsonRpcResponse<ReturnType>>({
      url: this.config.url,
      method,
      data: request.toObject(),
      timeout: this.config.timeout,
      headers: this.config.headers,
    });

    if (result.status !== 200) {
      throw new UnknownError(result.data);
    }

    if (result.data.error) {
      throw new RPCError(result.data.error);
    }

    return result.data;
  }
}
