import { PublicKey } from '@nearjs/account';
import {
  JsonRPCRequest, RequestId, RPCRequest, RPCRequestMethod,
} from '../request';

export class ViewAccessKey extends RPCRequest {
  public readonly accountId: string;

  public readonly publicKey: PublicKey;

  constructor(accountId: string, publicKey: PublicKey) {
    super();
    this.accountId = accountId;
    this.publicKey = publicKey;
  }

  toJsonRPCRequest(requestId: RequestId): JsonRPCRequest {
    return new JsonRPCRequest(requestId, RPCRequestMethod.QUERY, {
      request_type: 'view_access_key',
      finality: 'final',
      account_id: this.accountId,
      public_key: this.publicKey.toString(),
    });
  }
}

export type ViewAccessKeyResult = {
  nonce: number,
  permission: {
    FunctionCall: {
      allowance: string;
      receiver_id: string;
      method_names: string[];
    }
  } | 'FullAccess',
  block_height: number;
  block_hash: string;
};
