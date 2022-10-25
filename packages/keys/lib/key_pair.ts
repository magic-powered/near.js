import { box, sign } from 'tweetnacl';
import { KeyType, PrivateKey, PublicKey } from './public_key';

export class KeyPair {
  private readonly keyType: KeyType;

  private readonly publicKey: PublicKey;

  private readonly privateKey: PrivateKey;

  constructor(privateKey: PrivateKey, publicKey: PublicKey, keyType: KeyType = KeyType.ED25519) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.keyType = keyType;
  }

  public sign(message: Uint8Array): Uint8Array {
    return sign.detached(message, this.privateKey.data);
  }

  public verify(message: Uint8Array, signature: Uint8Array) {
    return sign.detached.verify(message, signature, this.publicKey.data);
  }

  public static random(keyType: KeyType = KeyType.ED25519): KeyPair {
    const keypair = box.keyPair();
    return new KeyPair({ data: keypair.secretKey }, { data: keypair.publicKey }, keyType);
  }

  public static fromPrivate(privateKey: PrivateKey, keyType: KeyType = KeyType.ED25519): KeyPair {
    const keypair = box.keyPair.fromSecretKey(privateKey.data);
    return new KeyPair({ data: keypair.secretKey }, { data: keypair.publicKey }, keyType);
  }
}
