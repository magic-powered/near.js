import { field, vec } from '@dao-xyz/borsh';

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
  switch (keyTypeString) {
    case 'ED25519':
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

  @field({ type: vec('u32') })
  readonly data: Uint8Array;

  constructor(data: Uint8Array, keyType = KeyType.ED25519) {
    this.data = data;
    this.keyType = keyType;
  }

  public toString(): string {
    return `${keyTypeToString(this.keyType)}:${Buffer.from(this.data).toString('base64')}`;
  }

  public static fromString(keyString: string): PublicKey {
    const [keyTypeString, keyBase64String] = keyString.split(':');

    if (!keyTypeString || !keyBase64String) {
      throw new Error(`Cannot reconstruct public key: ${keyString}`);
    }

    const keyType = stringToKeyType(keyTypeString);

    if (keyType === KeyType.UNKNOWN) {
      throw new Error(`Unsupported public key type ${keyTypeString}`);
    }

    const keyData = Buffer.from(keyBase64String, 'base64');

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
    return `${keyTypeToString(this.keyType)}:${Buffer.from(this.data).toString('base64')}`;
  }

  public static fromString(keyString: string): PrivateKey {
    const [keyTypeString, keyBase64String] = keyString.split(':');

    if (!keyTypeString || !keyBase64String) {
      throw new Error(`Cannot reconstruct private key: ${keyString}`);
    }

    const keyType = stringToKeyType(keyTypeString);

    if (keyType === KeyType.UNKNOWN) {
      throw new Error(`Unsupported private key type ${keyTypeString}`);
    }

    const keyData = Buffer.from(keyBase64String, 'base64');

    return new PrivateKey(keyData, keyType);
  }
}
