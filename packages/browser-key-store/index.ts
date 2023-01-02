import { KeyPair, KeyStore, KeyIdString } from '@near.js/account';

export interface BrowserLocalStorageKeyStoreConfig {
  baseKey?: string;

  storage?: Storage
}

export class BrowserKeyStore extends KeyStore {
  private readonly baseKey: string;

  private readonly storage: Storage;

  constructor(config?: BrowserLocalStorageKeyStoreConfig) {
    super();

    this.baseKey = (config && config.baseKey) ? config.baseKey : 'near.js';
    this.storage = (config && config.storage) ? config.storage : window.localStorage;
  }

  public async listKeys(): Promise<KeyIdString[]> {
    const listString = this.storage.getItem(this.buildStorageKey('list'));
    return JSON.parse(listString);
  }

  private buildStorageKey(keyIdString: KeyIdString): string {
    return `${this.baseKey}:${keyIdString}`;
  }

  private async updateList(keyIdString: KeyIdString) {
    const list = await this.listKeys();

    if (!list.includes(keyIdString)) {
      this.storage.setItem(this.buildStorageKey('list'), JSON.stringify(list));
    }
  }

  protected async storeKey(keyIdString: KeyIdString, keyPair: KeyPair): Promise<void> {
    this.storage.setItem(this.buildStorageKey(keyIdString), keyPair.toBase64JsonString());
  }

  protected async getKey(keyIdString: KeyIdString): Promise<KeyPair> {
    const base64JsonString = this.storage.getItem(this.buildStorageKey(keyIdString));

    return KeyPair.fromBase64JsonString(base64JsonString);
  }
}
