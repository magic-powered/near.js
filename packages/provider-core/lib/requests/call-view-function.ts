import {
  JsonRPCRequest, RequestId, RPCRequest, RPCRequestMethod,
} from '../request';

export class CallViewFunction extends RPCRequest {
  public readonly accountId: string;

  public readonly functionName: string;

  public readonly args: { [key: string]: any };

  constructor(accountId: string, functionName: string, args: { [key: string]: any }) {
    super();
    this.accountId = accountId;
    this.functionName = functionName;
    this.args = args;
  }

  toJsonRPCRequest(requestId: RequestId): JsonRPCRequest {
    return new JsonRPCRequest(requestId, RPCRequestMethod.QUERY, {
      request_type: 'call_function',
      finality: 'final',
      account_id: this.accountId,
      method_name: this.functionName,
      args_base64: Buffer.from(JSON.stringify(this.args)).toString('base64'),
    });
  }
}

export type CallViewFunctionResult = {
  block_hash: string;
  block_height: number;
  logs: string[];
  result: Uint8Array;
  parsedResult: string;
  error?: string;
};
