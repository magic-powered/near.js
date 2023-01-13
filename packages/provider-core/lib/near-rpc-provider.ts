import { PublicKey } from '@near.js/account';
import { Transaction, SignedTransaction } from '@near.js/tx';
import axios from 'axios';
import { IJsonRPCRequest, JsonRPCRequest, RPCRequest } from './request';
import { IJsonRpcResponse, RPCResponse } from './response';
import { RPCProviderConfig } from './config';
import { RPCError, UnknownError } from './errors';

export enum HTTPMethods {
  POST = 'POST',
  GET = 'GET',
}

export abstract class NearRPCProvider<ProviderConfig extends RPCProviderConfig> {
  protected requestId = 1;

  protected readonly config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  public abstract sign(accountId: string, message: Uint8Array): Promise<Uint8Array>;

  public abstract verify(
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: Uint8Array
  ): Promise<boolean>;

  public abstract getPublicKey(accountId: string): Promise<PublicKey>;

  public async signTransaction(
    accountId: string,
    transaction: Transaction,
  ): Promise<SignedTransaction> {
    const signature = await this.sign(accountId, transaction.getHash().data);
    return new SignedTransaction(transaction, signature);
  }

  protected async sendRawRequest<ReturnType>(
    requestObject: IJsonRPCRequest,
    method: HTTPMethods = HTTPMethods.POST,
  ): Promise<IJsonRpcResponse<ReturnType>> {
    this.requestId += 1;
    return this.sendJsonRpcRequest<ReturnType>(
      JsonRPCRequest.fromObject(this.requestId, requestObject),
      method,
    );
  }

  protected async sendRPCRequest<RequestType extends RPCRequest>(
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
    const req = {
      url: this.config.rpcUrl,
      method,
      data: request.toObject(),
      timeout: this.config.timeout,
      headers: this.config.headers,
    };

    const result = await axios.request<IJsonRpcResponse<ReturnType>>(req);

    if (result.status !== 200) {
      throw new UnknownError(result.data);
    }

    if (result.data.error) {
      throw new RPCError(result.data.error);
    }

    return result.data;
  }
}
