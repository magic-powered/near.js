import { KeyPair, KeyStore, KeyIdString } from '@nearjs/account';

export interface BrowserLocalStorageKeyStoreConfig {
  baseKey?: string;

  storage?: Storage
}

export class BrowserKeyStore extends KeyStore {
  private readonly baseKey: string;

  private readonly storage: Storage;

  constructor(config?: BrowserLocalStorageKeyStoreConfig) {
    super();

    this.baseKey = (config && config.baseKey) ? config.baseKey : 'nearjs';
    this.storage = (config && config.storage) ? config.storage : window.localStorage;
  }

  public async listKeys(): Promise<KeyIdString[]> {
    const listString = this.storage.getItem(this.buildStorageKey('list'));
    if (!listString) {
      return [];
    }

    return JSON.parse(listString);
  }

  private buildStorageKey(keyIdString: KeyIdString): string {
    return `${this.baseKey}:${keyIdString}`;
  }

  private async updateList(keyIdString: KeyIdString) {
    const list = await this.listKeys();

    if (!list.includes(keyIdString)) {
      list.push(keyIdString);
      this.storage.setItem(this.buildStorageKey('list'), JSON.stringify(list));
    }
  }

  protected async storeKey(keyIdString: KeyIdString, keyPair: KeyPair): Promise<void> {
    this.storage.setItem(this.buildStorageKey(keyIdString), keyPair.toBase64JsonString());
    await this.updateList(keyIdString);
  }

  protected async getKey(keyIdString: KeyIdString): Promise<KeyPair> {
    const base64JsonString = this.storage.getItem(
      this.buildStorageKey(keyIdString),
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return KeyPair.fromBase64JsonString(base64JsonString);
  }

  protected async deleteKey(keyIdString: KeyIdString): Promise<void> {
    if (!this.storage.getItem(this.buildStorageKey(keyIdString))) {
      return;
    }

    this.storage.removeItem(this.buildStorageKey(keyIdString));

    const keys = await this.listKeys();
    this.storage.setItem(this.buildStorageKey('list'), JSON.stringify(keys.filter((key) => key !== keyIdString)));
  }
}
