import { ITransaction } from '@near.js/tx';
import { KeyPair } from '@near.js/keys';
import { ISignedTransaction } from "./signed_transaction";

// TODO init with specific key pair

export class Signer {
  private readonly keyPair: KeyPair;

  constructor(keyPair: KeyPair) {
    this.keyPair = keyPair;
  }

  signTx(transaction: ITransaction): Promise<ISignedTransaction> {
    return null; // TODO
  }
}
