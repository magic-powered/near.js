import BN from 'bn.js';
import { PublicKey } from '@near.js/keys';
import { Action } from './action';
import { deserialize, field, serialize, vec } from "@dao-xyz/borsh";

export class Transaction {
  @field({ type: Action })
  public readonly actions: Action[];

  @field({ type: vec('u32')})
  public readonly blockHash: Uint8Array;

  @field({ type: 'u64' })
  public readonly nonce: BN;

  @field({ type: PublicKey })
  public readonly publicKey: PublicKey;

  @field({ type: 'string' })
  public readonly receiverId: string;

  @field({ type: 'string' })
  public readonly signerId: string;

  constructor(actions: Action[], blockHash: Uint8Array, nonce: BN, publicKey: PublicKey, receiverId: string, signerId: string) {
    this.actions = actions;
    this.blockHash = blockHash;
    this.nonce = nonce;
    this.publicKey = publicKey;
    this.receiverId = receiverId;
    this.signerId = signerId;
  }

  toBorsh(): Uint8Array {
    return serialize(this);
  }

  static fromBorsh(borsh: Uint8Array): Transaction {
    return deserialize(borsh, Transaction);
  }
}

