import { SignedTransaction } from '@nearjs/tx';
import {
  JsonRPCRequest, RequestId, RPCRequest, RPCRequestMethod,
} from '../request';

export class BroadcastTxSync extends RPCRequest {
  public readonly tx: string;

  constructor(tx: SignedTransaction) {
    super();
    this.tx = tx.toBorshString();
  }

  toJsonRPCRequest(requestId: RequestId): JsonRPCRequest {
    return new JsonRPCRequest(requestId, RPCRequestMethod.TX_COMMIT, [this.tx]);
  }
}

export type TransactionView = {
  actions: any[];
  hash: string;
  nonce: number;
  public_key: string;
  receiver_id: string;
  signature: string;
  signer_id: string;
};

export type Status = {
  Failure?: any;
  SuccessValue?: any;
  SuccessReceiptId?: any;
};

export type Metadata = {
  gas_profile: any;
  version: number;
};

export type Outcome = {
  executor_id: string;
  gas_burnt: number;
  logs: any[];
  metadata: Metadata;
  receipt_ids: string[];
  status: Status;
};

export type Proof = {
  direction: string;
  hash: string;
};

export type TransactionOutcome = {
  block_hash: string;
  id: string;
  outcome: Outcome;
  proof: Proof[];
};

export type BroadcastTxSyncResult = {
  receipts_outcome: TransactionOutcome[];
  status: Status;
  transaction: TransactionView;
  transaction_outcome: TransactionOutcome;
};
