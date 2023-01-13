import { field, fixedArray } from '@dao-xyz/borsh';

// TODO: typings
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { binary_to_base58 as toBase58, base58_to_binary as fromBase58 } from 'base58-js';

export enum KeyType {
  ED25519 = 0,

  UNKNOWN = 999,
}

export const keyTypeToString = (keyType: KeyType): string => {
  switch (keyType) {
    case KeyType.ED25519:
      return 'ED25519';
    default:
      return 'unknown';
  }
};

export const stringToKeyType = (keyTypeString: string): KeyType => {
  switch (keyTypeString.toLowerCase()) {
    case 'ed25519':
      return KeyType.ED25519;
    default:
      return KeyType.UNKNOWN;
  }
};

export interface IKey {
  keyType: KeyType;

  data: Uint8Array;

  toString(): string;
}

export class PublicKey implements IKey {
  @field({ type: 'u8' })
  readonly keyType: KeyType;

  @field({ type: fixedArray('u8', 32) })
  readonly data: Uint8Array;

  constructor(data: Uint8Array, keyType = KeyType.ED25519) {
    this.data = data;
    this.keyType = keyType;
  }

  public toString(): string {
    const b58String = toBase58(this.data);
    return `${keyTypeToString(this.keyType)}:${b58String}`;
  }

  public static fromString(keyString: string): PublicKey {
    const [keyTypeString, keyBase58String] = keyString.split(':');

    if (!keyTypeString || !keyBase58String) {
      throw new Error(`Cannot reconstruct public key: ${keyString}`);
    }

    const keyType = stringToKeyType(keyTypeString);

    if (keyType === KeyType.UNKNOWN) {
      throw new Error(`Unsupported public key type ${keyTypeString}`);
    }

    const keyData = fromBase58(keyBase58String);

    return new PublicKey(keyData, keyType);
  }
}

export class PrivateKey implements IKey {
  readonly keyType: KeyType;

  readonly data: Uint8Array;

  constructor(data: Uint8Array, keyType = KeyType.ED25519) {
    this.data = data;
    this.keyType = keyType;
  }

  public toString(): string {
    const b58String = toBase58(this.data);
    return `${keyTypeToString(this.keyType)}:${b58String}`;
  }

  public static fromString(keyString: string): PrivateKey {
    const [keyTypeString, keyBase58String] = keyString.split(':');

    if (!keyTypeString || !keyBase58String) {
      throw new Error(`Cannot reconstruct private key: ${keyString}`);
    }

    const keyType = stringToKeyType(keyTypeString);

    if (keyType === KeyType.UNKNOWN) {
      throw new Error(`Unsupported private key type ${keyTypeString}`);
    }

    const keyData = fromBase58(keyBase58String);

    return new PrivateKey(keyData, keyType);
  }
}
