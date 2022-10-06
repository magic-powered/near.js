import { ISignedTransaction } from '@near.js/signer';

// TODO: fix this
type TODO = any;

export interface IProvider {
  sendTx(transaction: ISignedTransaction): Promise<string>;
  // gas price
  // transaction info
  // txStatusReceipts
}
