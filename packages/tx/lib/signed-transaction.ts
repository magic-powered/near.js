import { KeyType } from '@nearjs/account';
import {
  deserialize, field, fixedArray, serialize,
} from '@dao-xyz/borsh';

import { Transaction } from './transaction';

export class Signature {
  @field({ type: 'u8' })
  public readonly keyType: KeyType;

  @field({ type: fixedArray('u8', 64) })
  public readonly data: Uint8Array;

  constructor(data: Uint8Array, keyType: KeyType) {
    this.data = data;
    this.keyType = keyType;
  }
}

export class SignedTransaction {
  @field({ type: Transaction })
  public readonly transaction: Transaction;

  @field({ type: Signature })
  public readonly signature: Signature;

  constructor(transaction: Transaction, signature: Uint8Array, keyType = KeyType.ED25519) {
    this.transaction = transaction;
    this.signature = new Signature(signature, keyType);
  }

  toBorsh(): Uint8Array {
    return serialize(this);
  }

  toBorshString(): string {
    return Buffer.from(this.toBorsh()).toString('base64');
  }

  static fromBorsh(borsh: Uint8Array): SignedTransaction {
    return deserialize(borsh, SignedTransaction);
  }

  static fromBorshString(borshString: string): SignedTransaction {
    return SignedTransaction.fromBorsh(Buffer.from(borshString, 'base64'));
  }
}
