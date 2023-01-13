import BN from 'bn.js';
import { PublicKey } from '@near.js/account';
import {
  deserialize, field, fixedArray, serialize, vec,
} from '@dao-xyz/borsh';
import { sha256 } from 'js-sha256';
// TODO: typings
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { binary_to_base58 as toBase58, base58_to_binary as fromBase58 } from 'base58-js';

import { Action } from './action';

export class TransactionHash {
  public readonly data: Uint8Array;

  constructor(data: Uint8Array) {
    this.data = data;
  }

  public toString(): string {
    return toBase58(this.data);
  }

  public static fromString(hashString: string): TransactionHash {
    return new TransactionHash(fromBase58(hashString));
  }
}

/*
    pub signer_id: AccountId,
    /// A public key of the access key which was used to sign an account.
    /// Access key holds permissions for calling certain kinds of actions.
    pub public_key: PublicKey,
    /// Nonce is used to determine order of transaction in the pool.
    /// It increments for a combination of `signer_id` and `public_key`
    pub nonce: Nonce,
    /// Receiver account for this transaction
    pub receiver_id: AccountId,
    /// The hash of the block in the blockchain on top of which the given transaction is valid
    pub block_hash: CryptoHash,
    /// A list of actions to be applied
    pub actions: Vec<Action>,
 */
export class Transaction {
  @field({ type: 'string' })
  public readonly signerId: string;

  @field({ type: PublicKey })
  public readonly publicKey: PublicKey;

  @field({ type: 'u64' })
  public readonly nonce: BN;

  @field({ type: 'string' })
  public readonly receiverId: string;

  @field({ type: fixedArray('u8', 32) })
  public readonly blockHash: Uint8Array;

  @field({ type: vec(Action) })
  public readonly actions: Action[];

  public readonly hash: TransactionHash;

  constructor(
    actions: Action[],
    receiverId: string,
    blockHash: Uint8Array,
    nonce: BN,
    publicKey: PublicKey,
    signerId: string,
  ) {
    this.actions = actions;
    this.blockHash = blockHash;
    this.nonce = nonce;
    this.publicKey = publicKey;
    this.receiverId = receiverId;
    this.signerId = signerId;

    const borsh = this.toBorsh();
    const hash = sha256.create();
    hash.update(borsh);
    this.hash = new TransactionHash(new Uint8Array(hash.array()));
  }

  public getHash(): TransactionHash {
    return this.hash;
  }

  public toBorsh(): Uint8Array {
    return serialize(this);
  }

  public toBorshString(): string {
    return Buffer.from(this.toBorsh()).toString('base64');
  }

  static fromBorsh(borsh: Uint8Array): Transaction {
    return deserialize(borsh, Transaction);
  }
}
