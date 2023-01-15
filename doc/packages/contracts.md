# @near.js/contracts

## Installation

```shell
npm i @near.js/contracts --save
```

```shell
yarn add @near.js/contracts
```

## About

The contracts package provides an abstract Contract class that can be extended to implement your own smart-contract client object.
Used for simplification of the interactions with the contracts deployed to the Near blockchain

## Usage

```typescript
import { FileSystemKeyStore } from '@near.js/fs-key-store';
import { ProviderMyNearWallet } from '@near.js/provider-wallet-my-near-wallet';
import { NonFungibleToken } from '@near.js/contracts';

const iam = 'toxa.testnet';
const friend = 'toxa02.testnet';
const nftContract = 'toxa.mintspace2.testnet';

(async () => {
  const keyStore = new FileSystemKeyStore();

  const provider = new ProviderMyNearWallet({
    networkId: 'testnet',
    rpcUrl: 'https://rpc.testnet.near.org',
    keyStore,
    walletBaseUrl: 'https://testnet.mynearwallet.com',
    throwIfInsufficientAllowance: true,
    window: {} as any
  });

  const nft = new NonFungibleToken(nftContract, provider);
  const myTokens = await nft.nftTokensForOwner(iam);

  await nft.nftTransfer(friend, myTokens[0].token_id);

  const myFriendsTokens = await nft.nftTokensForOwner(friend);
})();
```
The package supports FungibleTokens and NonFungibleTokens standards with fo;lowing NEPs:

- FT: NEP-141
- NFT: NEP-171 NEP-181 NEP-178 NEP-177 NEP-297

