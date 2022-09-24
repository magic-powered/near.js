export enum KeyType {
  ED25519 = 0,
}

export interface PublicKey {
  keyType: KeyType;
  data: Uint8Array;
}
