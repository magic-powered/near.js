export enum KeyType {
  ED25519 = 'ED25519',
}

export interface IKey {
  data: Uint8Array;
}

export interface PublicKey extends IKey {}

export interface PrivateKey extends IKey {}
