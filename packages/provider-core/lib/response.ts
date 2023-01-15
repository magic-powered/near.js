import { RPCErrorObject } from './errors';
import {
  Block,
  BlockResult,
  BroadcastTxSync,
  ViewAccount,
  ViewAccountResult,
  BroadcastTxSyncResult,
} from './requests';
import { CallViewFunction, CallViewFunctionResult } from './requests/call-view-function';

export interface IJsonRpcResponse<ResultType> {
  id: string;
  jsonrpc: string;
  result: ResultType;
  error?: RPCErrorObject;
}

export type RPCResponse<RequestType> = IJsonRpcResponse<
RequestType extends CallViewFunction ?
  CallViewFunctionResult :
  RequestType extends BroadcastTxSync ?
    BroadcastTxSyncResult :
    RequestType extends Block ?
      BlockResult :
      RequestType extends ViewAccount ?
        ViewAccountResult :
        unknown
>;
