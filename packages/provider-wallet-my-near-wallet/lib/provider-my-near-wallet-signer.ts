import { KeyId, KeyPair, PublicKey } from '@near.js/account';

import { ProviderMyNearWalletAccountManager } from './provider-my-near-wallet-account-manager';

export abstract class ProviderMyNearWalletSigner extends ProviderMyNearWalletAccountManager {
  public async sign(
    accountId: string,
    message: Uint8Array,
  ): Promise<Uint8Array> {
    const keyPair = await this.getKeyPair(accountId);

    return keyPair.sign(message);
  }

  // eslint-disable-next-line class-methods-use-this
  public async verify(
    message: Uint8Array,
    signature: Uint8Array,
    publicKey: Uint8Array,
  ): Promise<boolean> {
    return KeyPair.verifyWithPublicKey(message, signature, publicKey);
  }

  public async getPublicKey(accountId: string): Promise<PublicKey> {
    const keyPair = await this.getKeyPair(accountId);

    return keyPair.getPublicKey();
  }

  protected async getKeyPair(accountId: string): Promise<KeyPair> {
    const keyId = new KeyId(accountId, this.config.networkId);
    return this.config.keyStore.getKeyPairByKeyId(keyId);
  }

  protected async persistKeyPair(accountId: string, keyPair: KeyPair) {
    const keyId = new KeyId(accountId, this.config.networkId);
    this.config.keyStore.addKeyByKeyId(keyId, keyPair);
  }
}
