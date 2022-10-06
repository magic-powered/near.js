export type ERROR_TYPE = string; // TODO: make enum
export type ERROR_CAUSE = string; // TODO: make enum

export interface IJsonRpcResponse {
  id: string;
  jsonrpc: string;
  error?: {
    name: ERROR_TYPE;
    cause: {
      info: object;
      name: ERROR_CAUSE;
    };
    code: number;
    data: string;
    message: string;
  };
}

export interface IJsonRpcBroadcastTxResponse extends IJsonRpcResponse {
  result: string;
}
