import { ITransaction } from '@near.js/tx';
import { KeyPair } from '@near.js/keys';
import { ISignedTransaction } from "./signed_transaction";

// TODO: sign any (string)
// TODO: verify tx signature
// TODO: verify any signature

export class Signer {
  private readonly keyPair: KeyPair;

  constructor(keyPair: KeyPair) {
    this.keyPair = keyPair;
  }

  signTx(transaction: ITransaction): Promise<ISignedTransaction> {
    return null; // TODO
  }
}
