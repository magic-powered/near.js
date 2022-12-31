import { IAction } from "./action";
import { PublicKey } from '@near.js/keys';
import BN from "bn.js";
import { Transaction } from "./transaction";

export class TransactionBuilder {
  private actions: IAction[];
  private blockHash: Uint8Array;
  private nonce: BN;
  private publicKey: PublicKey;
  private receiverId: string;
  private signerId: string;

  public static builder(): TransactionBuilder {
    return new TransactionBuilder()
  }

  constructor() {
    this.actions = [];
  }

  public withActions(actions: IAction[]) {
    this.actions = actions;

    return this;
  }

  public addAction(action: IAction) {
    this.actions.push(action);

    return this;
  }

  public withBlockHash(blockHash: Uint8Array) {
    this.blockHash = blockHash;

    return this;
  }

  public withNonce(nonce: BN) {
    this.nonce = nonce;

    return this;
  }

  public withPublicKey(publicKey: PublicKey) {
    this.publicKey = publicKey;

    return this;
  }

  public withReceiverId(receiverId: string) {
    this.receiverId = receiverId;

    return this;
  }

  public withSignerId(signerId: string) {
    this.signerId = signerId;

    return this;
  }

  public build() {
    // TODO: make cool errors

    if (!this.actions.length) {
      throw new Error('You must specify at lease one action');
    }

    if (!this.blockHash) { // TODO: really?
      throw new Error('You must specify block hash');
    }

    if (!this.publicKey) {
      throw new Error('You must specify public key');
    }

    if (!this.nonce) {
      throw new Error('You must specify nonce');
    }

    if (!this.receiverId) { // TODO: really?
      throw new Error('You must specify receiver Id');
    }

    if (!this.signerId) {
      throw new Error('You must specify signerId');
    }

    return new Transaction(this.actions, this.blockHash, this.nonce, this.publicKey, this.receiverId, this.signerId);
  }
}
