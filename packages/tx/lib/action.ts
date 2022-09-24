import BN from 'bn.js';
import { AccessKey, PublicKey } from '@near.js/keys';

export interface IAction {}

export interface CreateAccount extends IAction {}

export interface DeployContract extends IAction {
  code: Uint8Array;
}

export interface FunctionCall extends IAction {
  method_name: string;
  args: Uint8Array;
  gas: BN;
  deposit: BN;
}

export interface Transfer extends IAction {
  deposit: BN;
}

export interface Stake extends IAction {
  stake: BN;
  public_key: PublicKey;
}

export interface AddKey extends IAction {
  public_key: PublicKey;
  access_key: AccessKey;
}

export interface DeleteKey extends IAction {
  public_key: PublicKey;
}

export interface DeleteAccount extends IAction {
  beneficiary_id: string;
}
