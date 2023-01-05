import { KeyId } from '@near.js/account';
import { AccountView } from '@near.js/provider-wallet-core';
import { ViewAccount } from '@near.js/provider-core';

import { ProviderMyNearWalletConnect } from './provider-my-near-wallet-connect';

export abstract class ProviderMyNearWalletAccountManager extends ProviderMyNearWalletConnect {
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
}
