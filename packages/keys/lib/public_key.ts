import { field, vec } from '@dao-xyz/borsh';

export enum KeyType {
  ED25519 = 'ED25519',
}

export interface IKey {
  keyType: KeyType;

  data: Uint8Array;
}

export class PublicKey implements IKey {
  @field({ type: 'u8' })
  readonly keyType: KeyType;

  @field({ type: vec('u32') })
  readonly data: Uint8Array;

  constructor(data: Uint8Array) {
    this.data = data;
  }
}

export class PrivateKey implements IKey {
  readonly keyType: KeyType;

  readonly data: Uint8Array;

  constructor(data: Uint8Array) {
    this.data = data;
  }
}
