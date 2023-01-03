import { KeyPair } from '../keys';

export type KeyIdString = string;

export class KeyId {
  private readonly accountId: string;

  private readonly networkId: string; // TODO: make enum

  constructor(accountId: string, networkId: string) {
    this.accountId = accountId;
    this.networkId = networkId;
  }

  public toString() {
    return `${this.accountId}.${this.networkId}`;
  }

  public static fromString(keyIdString: KeyIdString): KeyId {
    KeyId.validateKeyIdStringOrThrow(keyIdString);

    // TODO: introduce parse function
    const [accountId, networkId] = keyIdString.split('.');

    return new KeyId(accountId, networkId);
  }

  public static validateKeyIdString(keyIdString: KeyIdString) {
    return keyIdString.indexOf('.') !== -1;
  }

  public static validateKeyIdStringOrThrow(keyIdString: KeyIdString) {
    if (!KeyId.validateKeyIdString(keyIdString)) {
      throw new Error('Invalid key id'); // TODO: make good errors
    }
  }

  public static extractAccountId(keyIdString: KeyIdString): string {
    if (!this.validateKeyIdString(keyIdString)) {
      throw new Error('Invalid key id'); // TODO: make good errors
    }

    // TODO: introduce parse function
    return keyIdString.split('.')[0];
  }
}

export abstract class KeyStore {
  public addKeyByKeyId(keyId: KeyId, keyPair: KeyPair): Promise<void> {
    return this.addKeyByKeyIdString(keyId.toString(), keyPair);
  }

  public addKeyByKeyIdString(keyIdString: KeyIdString, keyPair: KeyPair): Promise<void> {
    KeyId.validateKeyIdStringOrThrow(keyIdString);
    return this.storeKey(keyIdString, keyPair);
  }

  protected abstract storeKey(keyIdString: KeyIdString, keyPair: KeyPair): Promise<void>;

  public getKeyPairByKeyId(keyId: KeyId): Promise<KeyPair> {
    return this.getKeyPairByKeyIdString(keyId.toString());
  }

  public getKeyPairByKeyIdString(keyIdString: KeyIdString): Promise<KeyPair> {
    KeyId.validateKeyIdStringOrThrow(keyIdString);
    return this.getKey(keyIdString);
  }

  public deleteKeyPairByKeyId(keyId: KeyId): Promise<void> {
    return this.deleteKeyPairByKeyIdString(keyId.toString());
  }

  public deleteKeyPairByKeyIdString(keyIdString: KeyIdString): Promise<void> {
    KeyId.validateKeyIdStringOrThrow(keyIdString);
    return this.deleteKey(keyIdString);
  }

  protected abstract deleteKey(keyIdString: KeyIdString): Promise<void>;

  protected abstract getKey(keyIdString: KeyIdString): Promise<KeyPair>;

  public abstract listKeys(): Promise<KeyIdString[]>;
}
