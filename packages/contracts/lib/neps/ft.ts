// TODO: remove nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Contract } from '../abstract-contract';

export interface FTMetadata {
  spec: string;
  name: string;
  symbol: string;
  icon: string;
  reference: string;
  reference_hash: string;
  decimals: number;
}

export class FungibleToken extends Contract {
  private metadata: FTMetadata;

  public async ftTransfer(
    receiverId: string,
    amount: string,
    memo?: string,
    gasLimit = 300000000000000,
  ) {
    return this.call(
      'ft_transfer',
      {
        receiver_id: receiverId,
        amount,
        memo,
      },
      gasLimit,
      '1',
    );
  }

  public async ftBalanceOf(accountId: string): Promise<string> {
    const result = await this.callView('ft_balance_of', {
      account_id: accountId,
    });

    return result.result.parsedResult.replace('"', '').replace('"', '');
  }

  public async ftMetadata(): Promise<FTMetadata> {
    if (this.metadata) {
      return this.metadata;
    }
    const result = await this.callView('ft_metadata', {});
    this.metadata = JSON.parse(result.result.parsedResult);
    return this.ftMetadata();
  }
}
