import axios from 'axios';
import { IJsonRPCRequest, JsonRPCRequest, RPCRequest } from './request';
import { IJsonRpcResponse, RPCResponse } from './response';
import { RPCProviderConfig } from './config';
import { RPCError, UnknownError } from './errors/rpc-error';

export enum HTTPMethods {
  POST = 'POST',
  GET = 'GET',
}

export abstract class NearRPCProvider<ProviderConfig extends RPCProviderConfig> {
  private requestId = 1;

  private readonly config: ProviderConfig;

  protected constructor(config: ProviderConfig) {
    this.config = config;
  }

  public async sendRawRequest<ReturnType>(
    requestObject: IJsonRPCRequest,
    method: HTTPMethods = HTTPMethods.POST,
  ): Promise<IJsonRpcResponse<ReturnType>> {
    this.requestId += 1;
    return this.sendJsonRpcRequest<ReturnType>(
      JsonRPCRequest.fromObject(this.requestId, requestObject),
      method,
    );
  }

  public async sendRPCRequest<RequestType extends RPCRequest>(
    rpcRequest: RequestType,
    method: HTTPMethods = HTTPMethods.POST,
  ): Promise<RPCResponse<RequestType>> {
    this.requestId += 1;
    return this.sendJsonRpcRequest(
      rpcRequest.toJsonRPCRequest(this.requestId),
      method,
    );
  }

  protected async sendJsonRpcRequest<ReturnType>(
    request: JsonRPCRequest,
    method: HTTPMethods = HTTPMethods.POST,
  ): Promise<IJsonRpcResponse<ReturnType>> {
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
