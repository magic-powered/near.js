import BN from 'bn.js';
import { PublicKey, AccessKey } from '@nearjs/account';
import { field, variant, vec } from '@dao-xyz/borsh';

export interface IAction {}

export abstract class Action implements IAction {}

@variant(0)
export class CreateAccount extends Action {}

@variant(1)
export class DeployContract extends Action {
  @field({ type: vec('u8') })
  readonly code: Uint8Array;

  constructor(code: Uint8Array) {
    super();
    this.code = code;
  }
}

@variant(2)
export class FunctionCall extends Action {
  @field({ type: 'string' })
  readonly method_name: string;

  @field({ type: vec('u8') })
  readonly args: Uint8Array;

  @field({ type: 'u64' })
  readonly gas: BN;

  @field({ type: 'u128' })
  readonly deposit: BN;

  constructor(
    methodName: string,
    args: { [key: string]: any },
    gas: number,
    deposit: string // TODO: see what we can do better
  ) {
    super();
    this.method_name = methodName;
    this.args = Buffer.from(JSON.stringify(args));
    this.gas = new BN(gas);
    this.deposit = new BN(deposit);
  }
}

@variant(3)
export class Transfer extends Action {
  @field({ type: 'u128' })
  readonly deposit: BN;

  constructor(deposit: number) {
    super();
    this.deposit = new BN(deposit);
  }
}

@variant(4)
export class Stake extends Action {
  @field({ type: 'u128' })
  readonly stake: BN;

  @field({ type: PublicKey })
  readonly public_key: PublicKey;

  constructor(stake: BN, publicKey: PublicKey) {
    super();
    this.stake = stake;
    this.public_key = publicKey;
  }
}

@variant(5)
export class AddKey extends Action {
  @field({ type: PublicKey })
  readonly public_key: PublicKey;

  @field({ type: AccessKey })
  readonly access_key: AccessKey;

  constructor(publicKey: PublicKey, accessKey: AccessKey) {
    super();
    this.public_key = publicKey;
    this.access_key = accessKey;
  }
}

@variant(6)
export class DeleteKey extends Action {
  @field({ type: PublicKey })
  readonly public_key: PublicKey;

  constructor(publicKey: PublicKey) {
    super();
    this.public_key = publicKey;
  }
}

@variant(7)
export class DeleteAccount extends Action {
  @field({ type: 'string' })
  readonly beneficiary_id: string;

  constructor(beneficiaryId: string) {
    super();
    this.beneficiary_id = beneficiaryId;
  }
}
