import { RPCErrorObject } from './errors';
import {
  Block,
  BlockResult,
  BroadcastTxSync,
  ViewAccount,
  ViewAccountResult,
  BroadcastTxSyncResult,
} from './requests';

export interface IJsonRpcResponse<ResultType> {
  id: string;
  jsonrpc: string;
  result: ResultType;
  error?: RPCErrorObject;
}

export type RPCResponse<RequestType> = IJsonRpcResponse<
RequestType extends ViewAccount ?
  ViewAccountResult :
  RequestType extends BroadcastTxSync ?
    BroadcastTxSyncResult :
    RequestType extends Block ?
      BlockResult :
      unknown
>;
