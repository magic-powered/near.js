# @nearjs/contracts

## Installation

```shell
npm i @nearjs/contracts --save
```

```shell
yarn add @nearjs/contracts
```

## About

The contracts package provides an abstract Contract class that can be extended to implement your own smart-contract client object.
Used for simplification of the interactions with the contracts deployed to the Near blockchain.

## Usage

The package supports FungibleTokens and NonFungibleTokens standards with folowing NEPs:

- FT: NEP-141
- NFT: NEP-171 NEP-181 NEP-178 NEP-177 NEP-297

### NFT tokens

```typescript
import { FileSystemKeyStore } from '@nearjs/fs-key-store';
import { NearRPCProvider, testnetRPCConfig } from '@nearjs/provider-core';
import { NonFungibleToken } from '@nearjs/contracts';

const iam = 'toxa.testnet';
const friend = 'toxa02.testnet';
const nftContract = 'toxa.mintspace2.testnet';

(async () => {
  const keyStore = new FileSystemKeyStore();

  const provider = new NearRPCProvider(testnetRPCConfig(keyStore));

  const nft = new NonFungibleToken(nftContract, provider);
  const myTokens = await nft.nftTokensForOwner(iam);

  await nft.nftTransfer(friend, myTokens[0].token_id);

  const myFriendsTokens = await nft.nftTokensForOwner(friend);
})();
```

### FT tokens

```typescript
import { FileSystemKeyStore } from '@nearjs/fs-key-store';
import { NearRPCProvider, testnetRPCConfig } from '@nearjs/provider-core';
import { FungibleToken } from '@nearjs/contracts';

const iam = 'toxa.testnet';
const friend = 'toxa02.testnet';
const ftContract = 'toxa.tokens.testnet';

(async () => {
  const keyStore = new FileSystemKeyStore();

  const provider = new NearRPCProvider(testnetRPCConfig(keyStore));

  const ft = new FungibleToken(nftContract, provider);
  const myTokens = await ft.ftBalanceOf(iam);

  await ft.ftTransfer(friend, 10);

  const myFriendsTokens = await ft.ftBalanceOf(friend);
})();
```

### Defining your custom contract interface

```typescript
import { Contract, NearRPCProvider, testnetRPCConfig } from '@nearjs/contracts';

export class MyCustomSmartContract extends Contract {
  public async myCallFunction1(
    arg1: string,
    arg2: string,
    gasLimit = 300000000000000,
  ) {
    return this.call(
      'my_call_function_1',
      {
        arg1,
        arg2
      },
      gasLimit,
      '1', // define yoctonear deposit if needed
    );
  }

  public async myViewFunction2(arg: string): Promise<{ [key: string]: string }> {
    const result = await this.callView('my_view_function_2', { arg });

    return result.result.parsedResult; // the base class will parse JSON responses for you
  }
}

(async () => {
  const contractAddress = 'some.contract.testnet';
  
  const keyStore = new FileSystemKeyStore();

  const provider = new NearRPCProvider(testnetRPCConfig(keyStore));

  const contract = new MyCustomSmartContract(contractAddress, provider);
  
  await contract.myCallFunction1('foo', 'bar');

  const response = contract.myViewFunction2('foo');
  
  console.log(response);
})();
```
