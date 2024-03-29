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

  public async listKeys(): Promise<KeyIdString[]> {
    return Object.keys(this.keyStore);
  }

  protected async deleteKey(keyIdString: KeyIdString): Promise<void> {
    if (!this.keyStore[keyIdString]) {
      return;
    }

    delete this.keyStore[keyIdString];
  }
}
