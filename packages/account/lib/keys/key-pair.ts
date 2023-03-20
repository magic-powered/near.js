import { sign } from 'tweetnacl';
import buffer from 'buffer/';
import { KeyType, PrivateKey, PublicKey } from './keys';
import { AccessKey, FullAccess } from './access-key';

if (window) {
  window.Buffer = window.Buffer || buffer.Buffer;
}

export class KeyPair {
  private readonly publicKey: PublicKey;

  private readonly privateKey: PrivateKey;

  private accessKey?: AccessKey;

  private nonce: number;

  constructor(
    privateKey: PrivateKey,
    publicKey: PublicKey,
    accessKey?: AccessKey,
    nonce?: number,
  ) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.accessKey = accessKey;
    this.nonce = nonce || 0;
  }

  public getAndIncrementNonce() {
    if (this.accessKey) {
      return this.accessKey.getAndIncrementNonce();
    }

    this.nonce += 1;
    return this.nonce;
  }

  public setNonce(newNonce: number) {
    if (this.accessKey) {
      this.accessKey.setNonce(newNonce);

      return;
    }

    this.nonce = newNonce;
  }

  public setAccessKey(accessKey: AccessKey) {
    this.accessKey = accessKey;
  }

  public isFullAccessKey() {
    if (!this.accessKey) {
      return false;
    }

    return this.accessKey.permission instanceof FullAccess;
  }

  public iterateNonce() {
    if (!this.accessKey) {
      throw new Error(`Access key is missing for key ${this.publicKey.toString()}`);
    }
    this.accessKey.nonce += 1;
    return this.accessKey.nonce;
  }

  public sign(message: Uint8Array): Uint8Array {
    return sign.detached(message, this.privateKey.data);
  }

  public verify(message: Uint8Array, signature: Uint8Array) {
    return sign.detached.verify(message, signature, this.publicKey.data);
  }

  public static verifyWithPublicKey(
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: Uint8Array,
  ) {
    return sign.detached.verify(message, signature, publicKey);
  }

  public getPublicKey(): PublicKey {
    return this.publicKey;
  }

  public getPrivateKey(): PrivateKey {
    return this.privateKey;
  }

  public toJsonString(): string {
    return JSON.stringify({
      publicKey: this.publicKey.toString(),
      privateKey: this.privateKey.toString(),
      accessKey: this.accessKey?.toString(),
      nonce: this.nonce,
    });
  }

  public static fromJson(keyPairJsonString: string): KeyPair {
    try {
      const parsed = JSON.parse(keyPairJsonString);

      const privateKey = PrivateKey.fromString(parsed.privateKey);
      const publicKey = PublicKey.fromString(parsed.publicKey);
      const accessKey = parsed.accessKey ? AccessKey.fromString(parsed.accessKey) : undefined;
      const nonce = parsed.nonce || 0;

      return new KeyPair(
        privateKey,
        publicKey,
        accessKey,
        nonce,
      );
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new Error(e);
    }
  }

  public toBase64JsonString(): string {
    return Buffer.from(this.toJsonString()).toString('base64');
  }

  public static fromBase64JsonString(base64JsonString: string): KeyPair {
    return KeyPair.fromJson(Buffer.from(base64JsonString, 'base64').toString());
  }

  public static fromRandom(keyType: KeyType = KeyType.ED25519): KeyPair {
    const keypair = sign.keyPair();

    return new KeyPair(
      new PrivateKey(keypair.secretKey, keyType),
      new PublicKey(keypair.publicKey, keyType),
    );
  }

  public static fromPrivate(privateKey: PrivateKey, keyType: KeyType = KeyType.ED25519): KeyPair {
    const keypair = sign.keyPair.fromSecretKey(privateKey.data);

    return new KeyPair(
      new PrivateKey(keypair.secretKey, keyType),
      new PublicKey(keypair.publicKey, keyType),
    );
  }

  public static fromSeed(seed: string, keyType: KeyType = KeyType.ED25519): KeyPair {
    const keyPair = sign.keyPair.fromSeed(new TextEncoder().encode(seed));

    return new KeyPair(
      new PrivateKey(keyPair.secretKey, keyType),
      new PublicKey(keyPair.publicKey, keyType),
    );
  }
}
