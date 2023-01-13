import {
  JsonRPCRequest, RequestId, RPCRequest, RPCRequestMethod,
} from '../request';

export class ViewAccount extends RPCRequest {
  public readonly accountId: string;

  constructor(accountId: string) {
    super();
    this.accountId = accountId;
  }

  toJsonRPCRequest(requestId: RequestId): JsonRPCRequest {
    return new JsonRPCRequest(requestId, RPCRequestMethod.QUERY, {
      request_type: 'view_account',
      finality: 'final',
      account_id: this.accountId,
    });
  }
}

export type ViewAccountResult = {
  amount: string;
  block_hash: string;
  block_height: number;
  code_hash: string;
  locked: string;
  storage_paid_at: number;
  storage_usage: number;
};
