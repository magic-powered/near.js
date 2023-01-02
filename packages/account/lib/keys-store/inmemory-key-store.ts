import { KeyIdString, KeyStore } from './keys-store';
import { KeyPair } from '../keys';

export class InMemoryKeyStore extends KeyStore {
  private readonly keyStore: { [key: KeyIdString]: KeyPair } = {};

  protected async getKey(keyIdString: KeyIdString): Promise<KeyPair> {
    if (!this.keyStore[keyIdString]) {
      throw new Error(`Key ${keyIdString} not found`);
    }

    return this.keyStore[keyIdString];
  }

  protected async storeKey(keyIdString: KeyIdString, keyPair: KeyPair): Promise<void> {
    this.keyStore[keyIdString] = keyPair;
  }

  listKeys(): Promise<KeyIdString[]> {
    return Promise.resolve(Object.keys(this.keyStore));
  }
}
