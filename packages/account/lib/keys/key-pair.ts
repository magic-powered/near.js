import { box, sign } from 'tweetnacl';
import { KeyType, PrivateKey, PublicKey } from './keys';
import { AccessKey } from './access-key';

export class KeyPair {
  private readonly publicKey: PublicKey;

  private readonly privateKey: PrivateKey;

  private accessKey?: AccessKey;

  constructor(
    privateKey: PrivateKey,
    publicKey: PublicKey,
    accessKey?: AccessKey,
  ) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.accessKey = accessKey;
  }

  public setAccessKey(accessKey: AccessKey) {
    this.accessKey = accessKey;
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

  public toJsonString(): string {
    return JSON.stringify({
      publicKey: this.publicKey.toString(),
      privateKey: this.privateKey.toString(),
      accessKey: this.accessKey.toString(),
    });
  }

  public static fromJson(keyPairJsonString: string): KeyPair {
    try {
      const parsed = JSON.parse(keyPairJsonString);

      const privateKey = PrivateKey.fromString(parsed.privateKey);
      const publicKey = PublicKey.fromString(parsed.publicKey);
      const accessKey = AccessKey.fromString(parsed.accessKey);

      return new KeyPair(
        privateKey,
        publicKey,
        accessKey,
      );
    } catch (e) {
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
    const keypair = box.keyPair();

    return new KeyPair(
      { data: keypair.secretKey, keyType },
      { data: keypair.publicKey, keyType },
    );
  }

  public static fromPrivate(privateKey: PrivateKey, keyType: KeyType = KeyType.ED25519): KeyPair {
    const keypair = box.keyPair.fromSecretKey(privateKey.data);

    return new KeyPair(
      { data: keypair.secretKey, keyType },
      { data: keypair.publicKey, keyType },
    );
  }
}
