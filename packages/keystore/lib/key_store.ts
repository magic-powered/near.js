import { KeyPair } from '@near.js/keys';

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

  protected abstract getKey(keyIdString: KeyIdString): Promise<KeyPair>;
}
