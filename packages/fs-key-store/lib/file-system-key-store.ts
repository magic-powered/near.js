import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { KeyPair, KeyIdString, KeyStore } from '@near.js/account';

export interface FileSystemStoreConfig {
  keysPath?: string;
}

export class FileSystemKeyStore extends KeyStore {
  private readonly keyStorePath: string;

  constructor(config?: FileSystemStoreConfig) {
    super();

    const keysFolder = config?.keysPath ? config.keysPath : os.homedir();

    this.keyStorePath = path.join(path.resolve(keysFolder), '.near-keys');
  }

  public async listKeys(): Promise<KeyIdString[]> {
    return fs.readdirSync(this.keyStorePath)
      .filter((fileName) => fileName.includes('.json'))
      .map((fileName) => fileName.replace('.json', ''));
  }

  private getKeyPath(keyIdString: KeyIdString) {
    return path.resolve(path.join(this.keyStorePath, `${keyIdString}.json`));
  }

  protected async getKey(keyIdString: KeyIdString): Promise<KeyPair> {
    const keyPath = this.getKeyPath(keyIdString);

    if (!fs.existsSync(keyPath)) {
      throw new Error(`Key ${keyIdString} not found.`);
    }

    const rawKey = fs.readFileSync(keyPath);

    return KeyPair.fromJson(rawKey.toString());
  }

  protected storeKey(keyIdString: KeyIdString, keyPair: KeyPair): Promise<void> {
    if (!fs.existsSync(this.keyStorePath)) {
      fs.mkdirSync(this.keyStorePath, { recursive: true });
    }

    const keyPath = this.getKeyPath(keyIdString);

    const oldTmpFile = `${keyPath}__old`;

    if (fs.existsSync(keyPath)) {
      fs.renameSync(keyPath, oldTmpFile);
    }

    try {
      fs.writeFileSync(keyPath, keyPair.toJsonString());
    } catch (e) {
      fs.renameSync(oldTmpFile, keyPath);

      return Promise.reject(e); // TODO: wrap this error
    }

    if (fs.existsSync(oldTmpFile)) {
      fs.rmSync(oldTmpFile);
    }

    return Promise.resolve();
  }

  protected async deleteKey(keyIdString: KeyIdString): Promise<void> {
    const keyPath = this.getKeyPath(keyIdString);

    if (!fs.existsSync(keyPath)) {
      return;
    }

    fs.rmSync(keyPath, { force: true });
  }
}
