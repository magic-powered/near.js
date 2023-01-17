// TODO: remove nocheck
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Contract } from '../abstract-contract';

export interface NFTMetadata {
  spec: string;
  name: string;
  symbol: string;
  icon: string;
  reference: string;
  reference_hash: string;
  base_uri: string;
}

export interface NFTTokenMetadata {
  title: string;
  description: string;
  media: string;
  media_hash: string;
  copies: number;
  issued_at: string;
  expires_at: string;
  starts_at: string;
  updated_at: string;
  extra: string;
  reference: string;
  reference_hash: string;
}

export interface NFTToken {
  token_id: string;
  owner_id: string;
  approved_account_ids: { [key: string]: number };
  metadata: NFTTokenMetadata;
  royalty: {
    split_between: { [key: string]: { enumerator: number } };
    percentage: { enumerator: number };
  };
  split_owners: string;
  minter: string;
  loan: string;
  composeable_stats: { local_depth: number; cross_contract_children: number };
  origin_key: string;
}

export interface NFTApproveEventData {
  token_id: string;
  approval_id: number;
  account_id: string;
}

export interface NftMintLog {
  owner_id: string;
  token_ids: string[];
  memo?: string;
}

export interface NftBurnLog {
  owner_id: string;
  authorized_id?: string;
  token_ids: string[];
  memo?: string;
}

export interface NftTransferLog {
  authorized_id?: string;
  old_owner_id: string;
  new_owner_id: string;
  token_ids: string[];
  memo?: string;
}

export interface NFTEvent<DataType> {
  standard: string;
  version: string;
  event: string;
  data: DataType;
}

export class NonFungibleToken extends Contract {
  private metadata: NFTMetadata;

  public async nftMetadata(): Promise<NFTMetadata> {
    if (this.metadata) {
      return this.metadata;
    }
    const result = await this.callView('nft_metadata', {});
    this.metadata = JSON.parse(result.result.parsedResult);
    return this.nftMetadata();
  }

  // APPROVAL MANAGEMENT

  public async nftApprove(
    tokenId: string,
    accountId: string,
    msg?: string,
    gasLimit = 300000000000000,
  ): Promise<NFTEvent<NFTApproveEventData>> {
    const result = await this.call(
      'nft_approve',
      {
        token_id: tokenId,
        account_id: accountId,
        msg,
      },
      gasLimit,
      '800000000000000000000',
    );

    if (
      result.result.receipts_outcome.length
      && result.result.receipts_outcome[0].outcome.logs.length
    ) {
      return JSON.parse(
        result.result.receipts_outcome[0].outcome.logs[0].replace(
          'EVENT_JSON:',
          '',
        ),
      );
    }

    if (result.result.status.Failure) {
      throw new Error(JSON.stringify(result.result.status.Failure));
    }

    // TODO: very important to log
    console.log('unexpected result');
    console.log(JSON.stringify(result, null, 2));
    throw new Error('Unexpected result');
  }

  public async nftIsApproved(
    tokenId: string,
    approvedAccountId: string,
    approvalId: number,
  ) {
    const result = await this.callView('nft_is_approved', {
      token_id: tokenId,
      approved_account_id: approvedAccountId,
      approval_id: approvalId,
    });

    return result.result.parsedResult === 'true';
  }

  public async nftRevoke(
    tokenId: string,
    accountId: string,
    gasLimit = 300000000000000,
  ) {
    return this.call(
      'nft_revoke',
      {
        token_id: tokenId,
        account_id: accountId,
      },
      gasLimit,
      '1',
    );
  }

  public async nftRevokeAll(tokenId: string, gasLimit = 300000000000000) {
    return this.call(
      'nft_revoke_all',
      {
        token_id: tokenId,
      },
      gasLimit,
      '1',
    );
  }

  // CORE

  public async nftTransfer(
    receiverId: string,
    tokenId: string,
    approvalId?: number,
    memo?: string,
    gasLimit = 300000000000000,
  ) {
    return this.call(
      'nft_transfer',
      {
        receiver_id: receiverId,
        token_id: tokenId,
        approval_id: approvalId,
        memo,
      },
      gasLimit,
      '1',
    );
  }

  public async nftTransferCall(
    receiverId: string,
    tokenId: string,
    msg: string,
    approvalId?: number,
    memo?: string,
    gasLimit = 300000000000000,
  ) {
    return this.call(
      'nft_transfer_call',
      {
        receiver_id: receiverId,
        token_id: tokenId,
        msg,
        approval_id: approvalId,
        memo,
      },
      gasLimit,
      '1',
    );
  }

  public async nftToken(tokenId: string): Promise<NFTToken> {
    const result = await this.callView('nft_token', { token_id: tokenId });

    return JSON.parse(result.result.parsedResult);
  }

  public async nftTotalSupply() {
    const result = await this.callView('nft_total_supply', {});

    return Number(result.result.parsedResult.replace('"', '').replace('"', ''));
  }

  public async nftSupplyForOwner(accountId: string) {
    const result = await this.callView('nft_supply_for_owner', {
      account_id: accountId,
    });

    return Number(result.result.parsedResult.replace('"', '').replace('"', ''));
  }

  public async nftTokens(
    fromIndex?: string,
    limit?: number,
  ): Promise<NFTToken[]> {
    const result = await this.callView('nft_tokens', {
      from_index: fromIndex,
      limit,
    });

    return JSON.parse(result.result.parsedResult);
  }

  public async nftTokensForOwner(
    accountId: string,
    fromIndex?: string,
    limit?: number,
  ): Promise<NFTToken[]> {
    const result = await this.callView('nft_tokens_for_owner', {
      account_id: accountId,
      from_index: fromIndex,
      limit,
    });

    return JSON.parse(result.result.parsedResult);
  }
}
