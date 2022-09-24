import BN from 'bn.js';
import { PublicKey } from '@near.js/keys';
import { IAction } from "./action";

export interface ITransaction {
  signerId: string;
  publicKey: PublicKey;
  nonce: BN;
  receiverId: string;
  actions: IAction[];
  blockHash: Uint8Array;
}
