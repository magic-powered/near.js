import {
  KeyPair,
  KeyId,
  KeyType,
} from '@nearjs/account';

import { v4 as uuid } from 'uuid';

import { MyNearWalletSignInOptions } from './my-near-wallet-sign-in-options';
import { ProviderMyNearWalletTransactionSender } from './provider-my-near-wallet-transaction-sender';

export const AUTH_ID_URL_QUERY_PARAM = 'nearJsAuthId';

export abstract class ProviderMyNearWalletConnect
  extends ProviderMyNearWalletTransactionSender {
  public async connectAccount(
    signInOptions: MyNearWalletSignInOptions = {},
  ): Promise<string> {
    if (!this.config.keyStore) {
      throw new Error('Cannot authenticate user without KeyStore');
    }

    if (!this.config.window) { // TODO: use open pkg to open browser if it is not browser
      throw new Error('Can connect wallet only in browser');
    }

    return this.connectAccountInBrowser(signInOptions);
  }

  private async connectAccountInBrowser(
    signInOptions: MyNearWalletSignInOptions = {},
  ): Promise<string> {
    if (!this.config.window) {
      throw new Error('Cannot start login via popup outside browser environment');
    }

    if (!this.config.keyStore) {
      throw new Error('Cannot authenticate user without KeyStore');
    }

    const currentUrl = new URL(this.config.window.location.href);
    if (!currentUrl.searchParams.has(AUTH_ID_URL_QUERY_PARAM)) {
      await this.startLogin(signInOptions);
      return '';
    }

    return this.completeAuth();
  }

  private async completeAuth(): Promise<string> {
    if (!this.config.window) {
      throw new Error('Cannot authenticate outside browser environment');
    }

    if (!this.config.keyStore) {
      throw new Error('Cannot authenticate user without KeyStore');
    }

    const currentUrl = new URL(this.config.window.location.href);
    const authId = currentUrl.searchParams.get(AUTH_ID_URL_QUERY_PARAM);

    if (!authId) {
      throw new Error('Unknown auth id');
    }

    const accountId = currentUrl.searchParams.get('account_id') || '';
    if (accountId) {
      // TODO: what if there is no accountId
      const keyPair = await this.config.keyStore.getKeyPairByKeyIdString(
        `pending::${authId}`,
      );

      if (keyPair) {
        await this.config.keyStore.deleteKeyPairByKeyIdString(
          `pending::${authId}`,
        );

        // TODO: fetch accessKey
        // TODO: put access key to the key pair
        const keyId = new KeyId(accountId, this.config.networkId);

        await this.config.keyStore.addKeyByKeyId(keyId, keyPair);

        await this.fetchAccessKey(accountId);
      }
    }
    currentUrl.searchParams.delete('public_key');
    currentUrl.searchParams.delete('all_keys');
    currentUrl.searchParams.delete('account_id');
    currentUrl.searchParams.delete('meta');
    currentUrl.searchParams.delete('transactionHashes');
    currentUrl.searchParams.delete(AUTH_ID_URL_QUERY_PARAM);

    this.config.window.history.replaceState(
      {},
      document.title,
      currentUrl.toString(),
    );

    return accountId;
  }

  private async startLogin(signInOptions: MyNearWalletSignInOptions = {}) {
    if (!this.config.window) {
      throw new Error('Cannot start login via popup outside browser environment');
    }

    if (!this.config.keyStore) {
      throw new Error('Cannot authenticate user without KeyStore');
    }

    const authId = uuid();

    let publicKey: string | undefined;

    if (signInOptions.contractId || signInOptions.fullAccess) {
      const keyPair = KeyPair.fromRandom(KeyType.ED25519);

      await this.config.keyStore.addKeyByKeyIdString(`pending::${authId}`, keyPair);

      publicKey = keyPair.getPublicKey().toString();
    }

    this.config.window.location.assign(this.constructLoginLink(authId, signInOptions, publicKey));
  }

  public constructLoginLink(
    authId: string,
    signInOptions: MyNearWalletSignInOptions = {},
    publicKey?: string,
  ): string {
    const loginUrl = new URL(`${this.config.walletBaseUrl}/login`);

    const callbackUrlBasePath = signInOptions.callbackUrl
    || !this.config.window ? this.config.walletBaseUrl : this.config.window.location.href;

    const callbackUrl = new URL(callbackUrlBasePath);
    callbackUrl.searchParams.set(AUTH_ID_URL_QUERY_PARAM, authId);

    loginUrl.searchParams.set('success_url', callbackUrl.toString());
    loginUrl.searchParams.set('failure_url', callbackUrl.toString());

    if (signInOptions.contractId) {
      loginUrl.searchParams.set('contract_id', signInOptions.contractId);
    }

    if (publicKey) {
      loginUrl.searchParams.set('public_key', publicKey);
    }

    if (signInOptions.methodNames) {
      signInOptions.methodNames.forEach((methodName) => {
        loginUrl.searchParams.append('methodNames', methodName);
      });
    }

    return loginUrl.toString();
  }
}
