import { BroadcastTxSync, NearRPCProvider, RPCResponse } from '@nearjs/provider-core';
import { IAction } from '@nearjs/tx';
import { MyNearWalletConfiguration } from './my-near-wallet-configuration';

export abstract class ProviderMyNearWalletTransactionSender
  extends NearRPCProvider<MyNearWalletConfiguration> {
  public async sendTransactionSync(
    senderAccountId: string,
    receiverAccountId: string,
    actions: IAction[],
  ): Promise<RPCResponse<BroadcastTxSync>> {
    const hasNonZeroDeposit = actions.filter((action) => !!action.deposit).length > 0;

    const senderKeyPair = await this.getKeyPair(senderAccountId);
    if (hasNonZeroDeposit && senderKeyPair && !senderKeyPair.isFullAccessKey()) {
      if (this.config.blockPopupFallback) {
        throw new Error('Cannot send direct RPC calls without full access key. Please provide full access key');
      }

      // TODO: deal with popup fallback (investigate how open popup without permission of the browser)
      // @ts-ignore
      return this.sendTransactionPopup(senderAccountId, receiverAccountId, actions);
    }

    return super.sendTransactionSync(senderAccountId, receiverAccountId, actions);
  }

  public async sendTransactionPopup(
    senderAccountId: string,
    receiverAccountId: string,
    actions: IAction[],
    callbackUrl?: string,
    meta?: string,
  ): Promise<void> {
    const currentUrl = new URL(window.location.href);
    const newUrl = new URL('sign', this.config.walletBaseUrl);

    const tx = await this.buildTransaction(senderAccountId, receiverAccountId, actions);

    newUrl.searchParams.set('transactions', tx.toBorshString());
    newUrl.searchParams.set('callbackUrl', callbackUrl || currentUrl.href);
    if (meta) {
      newUrl.searchParams.set('meta', meta);
    }

    window.location.assign(newUrl.toString());
  }
}
