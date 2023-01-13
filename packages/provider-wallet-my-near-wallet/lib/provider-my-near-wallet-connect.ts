import { KeyPair, KeyId, KeyType } from '@near.js/account';
import { ProviderWallet } from '@near.js/provider-wallet-core';

import { v4 as uuid } from 'uuid';

import { MyNearWalletConfiguration } from './my-near-wallet-configuration';
import { MyNearWalletSignInOptions } from './my-near-wallet-sign-in-options';

export const AUTH_ID_URL_QUERY_PARAM = 'nearJsAuthId';

export abstract class ProviderMyNearWalletConnect
  extends ProviderWallet<MyNearWalletConfiguration> {
  private pendingAuth: string[] = [];

  public async connectAccount(
    signInOptions: MyNearWalletSignInOptions = {},
  ): Promise<void> {
    if (!this.config.window) { // TODO: use open pkg to open browser if it is not browser
      throw new Error('Can connect wallet only in browser');
    }

    return this.connectAccountInBrowser(signInOptions);
  }

  private async connectAccountInBrowser(
    signInOptions: MyNearWalletSignInOptions = {},
  ): Promise<void> {
    const currentUrl = new URL(this.config.window.location.href);
    if (!this.pendingAuth.length || !currentUrl.searchParams.has(AUTH_ID_URL_QUERY_PARAM)) {
      // TODO: this is essentially a copy-paste from near-api-js.
      // TODO: We want to consider leveraging opening popup without blocking
      this.config.window.location.assign(await this.constructLoginLink(signInOptions));
      return;
    }

    await this.completeAuth();
  }

  private async completeAuth(): Promise<void> {
    const currentUrl = new URL(this.config.window.location.href);
    const authId = currentUrl.searchParams.get(AUTH_ID_URL_QUERY_PARAM);
    if (!this.pendingAuth.includes(authId)) {
      throw new Error('Unknown auth id');
    }

    const accountId = currentUrl.searchParams.get('account_id') || '';
    if (accountId) { // TODO: what if there is no accountId
      const keyPair = await this.config.keyStore.getKeyPairByKeyIdString(`pending:${authId}`);

      await this.config.keyStore.deleteKeyPairByKeyIdString(`pending:${authId}`);
      this.pendingAuth = this.pendingAuth.filter((id) => id !== authId);

      // TODO: fetch accessKey
      // TODO: put access key to the key pair

      const keyId = new KeyId(accountId, this.config.networkId);
      await this.config.keyStore.addKeyByKeyId(keyId, keyPair);

      // TODO: should we verify somehow that key is added to the account? - probably yes
    }
    currentUrl.searchParams.delete('public_key');
    currentUrl.searchParams.delete('all_keys');
    currentUrl.searchParams.delete('account_id');
    currentUrl.searchParams.delete('meta');
    currentUrl.searchParams.delete('transactionHashes');
    currentUrl.searchParams.delete(AUTH_ID_URL_QUERY_PARAM);

    this.config.window.history.replaceState({}, document.title, currentUrl.toString());
  }

  private async constructLoginLink(
    signInOptions: MyNearWalletSignInOptions = {},
  ): Promise<string> {
    const authId = uuid();
    const loginUrl = new URL(`${this.config.walletBaseUrl}/login`);

    const callbackUrl = new URL(signInOptions.callbackUrl || this.config.window.location.href);
    callbackUrl.searchParams.set(AUTH_ID_URL_QUERY_PARAM, authId);

    loginUrl.searchParams.set('success_url', callbackUrl.toString());
    loginUrl.searchParams.set('failure_url', callbackUrl.toString());

    if (signInOptions.contract) {
      loginUrl.searchParams.set('contract_id', signInOptions.contract);
      const keyPair = KeyPair.fromRandom(KeyType.ED25519);

      this.pendingAuth.push(authId);
      loginUrl.searchParams.set('public_key', keyPair.getPublicKey()
        .toString());

      await this.config.keyStore.addKeyByKeyIdString(`pending:${authId}`, keyPair);
    }

    if (signInOptions.methods) {
      signInOptions.methods.forEach((methodName) => {
        loginUrl.searchParams.append('methodNames', methodName);
      });
    }

    return loginUrl.toString();
  }
}
