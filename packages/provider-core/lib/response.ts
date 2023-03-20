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
import { ViewAccessKey, ViewAccessKeyResult } from './requests/view-access-key';

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
    RequestType extends ViewAccessKey ?
      ViewAccessKeyResult :
      RequestType extends Block ?
        BlockResult :
        RequestType extends ViewAccount ?
          ViewAccountResult :
          unknown
>;
