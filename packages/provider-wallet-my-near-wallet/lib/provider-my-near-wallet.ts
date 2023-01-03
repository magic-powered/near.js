import { KeyPair, KeyType, KeyId } from '@near.js/account';
import {
  AccountView,
  ProviderWalletCore,
  WalletConnectOptions,
} from '@near.js/provider-wallet-core';
import { RPCRequest, RPCResponse, ViewAccount } from '@near.js/provider-core';
import { v4 as uuid } from 'uuid';

import { MyNearWalletConfiguration } from './config';

export const AUTH_ID_URL_QUERY_PARAM = 'nearJsAuthId';

export interface MyNearWalletSignInOptions extends WalletConnectOptions {
  contract?: string;

  methods?: string[];

  callbackUrl?: string;
}

export class ProviderMyNearWallet extends ProviderWalletCore<MyNearWalletConfiguration> {
  private pendingAuth: string[] = [];

  public async connectAccount(
    signInOptions: MyNearWalletSignInOptions = {},
  ): Promise<void> {
    // TODO: do not use window object directly !!!
    if (!window) { // TODO: use open pkg to open browser if it is not browser
      throw new Error('Can connect wallet only in browser');
    }

    return this.connectAccountInBrowser(signInOptions);
  }

  private async connectAccountInBrowser(
    signInOptions: MyNearWalletSignInOptions = {},
  ): Promise<void> {
    // TODO: do not use window object directly
    const currentUrl = new URL(window.location.href);
    if (!this.pendingAuth.length || !currentUrl.searchParams.has(AUTH_ID_URL_QUERY_PARAM)) {
      // TODO: this is essentially a copy-paste from near-api-js.
      // TODO: We want to consider leveraging opening popup without blocking
      // TODO: do not use window object directly!!!
      window.location.assign(await this.constructLoginLink(signInOptions));
      return;
    }

    await this.completeAuth();
  }

  private async completeAuth(): Promise<void> {
    const currentUrl = new URL(window.location.href);
    const authId = currentUrl.searchParams.get(AUTH_ID_URL_QUERY_PARAM);
    if (!this.pendingAuth.includes(authId)) {
      throw new Error('Unknown auth id');
    }

    const accountId = currentUrl.searchParams.get('account_id') || '';
    if (accountId) { // TODO: what if there is no accountId
      const keyPair = await this.config.keyStore.getKeyPairByKeyIdString(`pending:${authId}`);

      await this.config.keyStore.deleteKeyPairByKeyIdString(`pending:${authId}`);
      this.pendingAuth = this.pendingAuth.filter((id) => id !== authId);

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

    window.history.replaceState({}, document.title, currentUrl.toString());
  }

  public async constructLoginLink(
    signInOptions: MyNearWalletSignInOptions = {},
  ): Promise<string> {
    const authId = uuid();
    const loginUrl = new URL(`${this.config.walletBaseUrl}/login`);

    const callbackUrl = new URL(signInOptions.callbackUrl || window.location.href);
    callbackUrl.searchParams.set(AUTH_ID_URL_QUERY_PARAM, authId);

    loginUrl.searchParams.set('success_url', callbackUrl.toString());
    loginUrl.searchParams.set('failure_url', callbackUrl.toString());

    if (signInOptions.contract) {
      loginUrl.searchParams.set('contract_id', signInOptions.contract);
      const keyPair = KeyPair.fromRandom(KeyType.ED25519);

      this.pendingAuth.push(authId);
      loginUrl.searchParams.set('public_key', keyPair.getPublicKey().toString());

      await this.config.keyStore.addKeyByKeyIdString(`pending:${authId}`, keyPair);
    }

    if (signInOptions.methods) {
      signInOptions.methods.forEach((methodName) => {
        loginUrl.searchParams.append('methodNames', methodName);
      });
    }

    return loginUrl.toString();
  }

  public async listConnectedAccounts(): Promise<string[]> {
    const keyIdStrings = await this.config.keyStore.listKeys();
    return keyIdStrings.map(KeyId.extractAccountId);
  }

  public async isAccountConnected(accountId: string): Promise<boolean> {
    const connectedAccounts = await this.listConnectedAccounts();

    return connectedAccounts.includes(accountId);
  }

  public async viewAccount(accountId: string): Promise<AccountView> {
    const result = await this.sendRPCRequest(new ViewAccount(accountId));

    return {
      balance: result.result.amount, // TODO: parse unit (YoctoNear -> Near)
      blockHash: result.result.block_hash,
      blockHeight: result.result.block_height,
      codeHash: result.result.code_hash,
      locked: result.result.locked,
      storagePaidAt: result.result.storage_paid_at,
      storageUsage: result.result.storage_paid_at,
    };
  }

  public signAndSend<RequestType extends RPCRequest>(
    rpcRequest: RequestType,
  ): Promise<RPCResponse<RequestType>> {
    // TODO: define when we should open wallet
    return this.sendRPCRequest(rpcRequest);
  }

  public sendViewRequest<RequestType extends RPCRequest>(
    rpcRequest: RequestType,
  ): Promise<RPCResponse<RequestType>> {
    // TODO: define how we can separate view methods out from non-view methods
    return this.sendRPCRequest(rpcRequest);
  }

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
