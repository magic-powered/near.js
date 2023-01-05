import { KeyId, KeyPair } from '@near.js/account';

import { ProviderMyNearWalletAccountManager } from './provider-my-near-wallet-account-manager';

export abstract class ProviderMyNearWalletSigner extends ProviderMyNearWalletAccountManager {
  public async sign(
    accountId: string,
    message: Uint8Array,
  ): Promise<Uint8Array> {
    // TODO: only one wallet can be connected or multiple? We think multiple
    const keyId = new KeyId(accountId, this.config.networkId);
    const keyPair = await this.config.keyStore.getKeyPairByKeyId(keyId);

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

  public async getPublicKey(accountId: string): Promise<Uint8Array> {
    const keyId = new KeyId(accountId, this.config.networkId);
    const keyPair = await this.config.keyStore.getKeyPairByKeyId(keyId);

    return keyPair.getPublicKey().data;
  }
}
