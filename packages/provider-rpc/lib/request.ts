export abstract class JsonRpcRequest {
  public readonly jsonrpc: "2.0";
  public readonly id: number;
  public readonly method: string;
  public readonly params: any;

  constructor(id: number, method: string) {
    this.id = id;
    this.method = method;
  }

  public toObject() {
    return {
      jsonrpc: this.jsonrpc,
      id: this.id,
      method: this.method,
      params: this.params
    };
  }
}

export class JsonRpcRequestBroadcastTx extends JsonRpcRequest {
  public readonly params: string[];

  constructor(id: number, tx: string) {
    super(id, "broadcast_tx_async");
    this.params = [tx];
  }
}
