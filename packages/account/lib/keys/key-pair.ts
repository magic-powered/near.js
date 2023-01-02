import { box, sign } from 'tweetnacl';
import { KeyType, PrivateKey, PublicKey } from './keys';

export class KeyPair {
  private readonly publicKey: PublicKey;

  private readonly privateKey: PrivateKey;

  constructor(privateKey: PrivateKey, publicKey: PublicKey) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  public sign(message: Uint8Array): Uint8Array {
    return sign.detached(message, this.privateKey.data);
  }

  public verify(message: Uint8Array, signature: Uint8Array) {
    return sign.detached.verify(message, signature, this.publicKey.data);
  }

  public getPublicKey(): PublicKey {
    return this.publicKey;
  }

  public toJsonString(): string {
    return JSON.stringify({
      privateKey: this.privateKey.toString(),
    });
  }

  public static fromJson(keyPairJsonString: string): KeyPair {
    try {
      const parsed = JSON.parse(keyPairJsonString);

      return KeyPair.fromPrivate(PrivateKey.fromString(parsed.privateKey));
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
    // TODO: why we have KeyType here???
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
