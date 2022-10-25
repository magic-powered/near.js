import { RPCErrorObject } from './errors';
import { BroadcastTx, ViewAccount } from './request';

export interface IJsonRpcResponse<ResultType> {
  id: string;
  jsonrpc: string;
  result: ResultType
  error?: RPCErrorObject;
}

export type BroadcastTxResult = string;

export type ViewAccountResult = {
  amount: string;
  block_hash: string;
  block_height: number;
  code_hash: string;
  locked: string;
  storage_paid_at: number;
  storage_usage: number;
};

export type RPCResponse<RequestType> = IJsonRpcResponse<
RequestType extends ViewAccount ?
  ViewAccountResult :
  RequestType extends BroadcastTx ?
    BroadcastTxResult :
    unknown
>;
