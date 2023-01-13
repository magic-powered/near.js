import {
  JsonRPCRequest, RequestId, RPCRequest, RPCRequestMethod,
} from '../request';

export class Block extends RPCRequest {
  public readonly finality?: string; // TODO: enum

  public readonly blockId?: number | string; // TODO: id (height?) or hash type

  constructor(finality?: string, blockId?: number) {
    super();
    if (!finality && !blockId) {
      throw new Error('Should specify at least one: finality OR block_id');
    } // TODO: consider put 'final' finality as default value

    this.blockId = blockId;
    this.finality = finality;
  }

  toJsonRPCRequest(requestId: RequestId): JsonRPCRequest {
    let params = {};
    if (this.finality) {
      params = {
        ...params,
        finality: this.finality,
      };
    }

    if (this.blockId) {
      params = {
        ...params,
        block_id: this.blockId,
      };
    }

    return new JsonRPCRequest(requestId, RPCRequestMethod.BLOCK, params);
  }
}

export type Chunk = {
  chunk_hash: string;
  prev_block_hash: string;
  outcome_root: string;
  prev_state_root: string;
  encoded_merkle_root: string;
  encoded_length: number;
  height_created: number;
  height_included: number;
  shard_id: number;
  gas_used: number;
  gas_limit: number;
  rent_paid: string;
  validator_reward: string;
  balance_burnt: string;
  outgoing_receipts_root: string;
  tx_root: string;
  validator_proposals: any[];
  signature: string;
};

export type BlockHeader = {
  height: number;
  epoch_id: string;
  next_epoch_id: string;
  hash: string;
  prev_hash: string;
  prev_state_root: string;
  chunk_receipts_root: string;
  chunk_headers_root: string;
  chunk_tx_root: string;
  outcome_root: string;
  chunks_included: number;
  challenges_root: string;
  timestamp: number;
  timestamp_nanosec: string;
  random_value: string;
  validator_proposals: any[];
  chunk_mask: boolean[];
  gas_price: string;
  rent_paid: string;
  validator_reward: string;
  total_supply: string;
  challenges_result: any[];
  last_final_block: string;
  last_ds_final_block: string;
  next_bp_hash: string;
  block_merkle_root: string;
  approvals: string[];
  signature: string;
  latest_protocol_version: number;
};

export type BlockResult = {
  author: string;
  header: BlockHeader;
  chunks: Chunk[];
};
