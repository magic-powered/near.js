export enum RPCRequestMethod {
  BLOCK = 'block',
  TX_ASYNC = 'broadcast_tx_async',
  TX_COMMIT = 'broadcast_tx_commit',
  CHUNK = 'chunk',
  GAS_PRICE = 'gas_price',
  HEALTH = 'health',
  LIGHT_CLIENT_PROOF = 'light_client_proof',
  NEXT_LIGHT_CLIENT_BLOCK = 'next_light_client_block',
  NETWORK_INFO = 'network_info',
  QUERY = 'query',
  STATUS = 'status',
  TX = 'tx',
  VALIDATORS = 'validators',
}

export interface IJsonRPCRequest {
  method: RPCRequestMethod;
  params: unknown;
}

export type RequestId = number;

export class JsonRPCRequest {
  public readonly jsonrpc: '2.0';

  public readonly id: RequestId;

  public readonly method: RPCRequestMethod;

  public readonly params: any;

  constructor(id: RequestId, method: RPCRequestMethod, params?: any) {
    this.jsonrpc = '2.0';
    this.id = id;
    this.method = method;
    this.params = params;
  }

  public toObject() {
    return {
      jsonrpc: this.jsonrpc,
      id: this.id,
      method: this.method,
      params: this.params,
    };
  }

  public static fromObject(requestId: number, request: IJsonRPCRequest) {
    return new JsonRPCRequest(requestId, request.method, request.params);
  }
}

export abstract class RPCRequest {
  public abstract toJsonRPCRequest(requestId: RequestId): JsonRPCRequest;
}
