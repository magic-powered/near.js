# @nearjs/provider-wallet-my-near-wallet

## Installation

```shell
npm i @nearjs/provider-wallet-my-near-wallet --save
```

```shell
yarn add @nearjs/provider-wallet-my-near-wallet
```

## Usage

Provides the full integration with MyNearWallet

### Connect account

```typescript
import { FileSystemKeyStore } from '@nearjs/fs-key-store';
import { ProviderMyNearWallet } from '@nearjs/provider-wallet-my-near-wallet';


(async () => {
  const keyStore = new FileSystemKeyStore();

  const provider = new ProviderMyNearWallet({
    keyStore,
    walletBaseUrl: 'https://testnet.mynearwallet.com',
    window: {} as Window,
    rpcUrl: 'https://rpc.testnet.near.org',
    networkId: 'testnet'
  });
  

  await provider.connectAccount({
    contract: 'toxa.tokens.testnet',
    methods: 'ft_transfer'
  });
})();
```

### Sending transactions

```typescript
import { FileSystemKeyStore } from '@nearjs/fs-key-store';
import { ProviderMyNearWallet } from '@nearjs/provider-wallet-my-near-wallet';
import { FunctionCall } from '@nearjs/tx';


(async () => {
  const keyStore = new FileSystemKeyStore();

  const provider = new ProviderMyNearWallet({
    keyStore,
    walletBaseUrl: 'https://testnet.mynearwallet.com',
    window: {} as Window,
    rpcUrl: 'https://rpc.testnet.near.org',
    networkId: 'testnet'
  });

  const actions = [
    new FunctionCall(
      'ft_transfer',
      {
        receiver_id: 'toxa02.testnet',
        amount: '200000000000000000000'
      },
      1,
      1
    )
  ];

  const result = await provider.sendTransactionSync('toxa.testnet', 'toxa.tokens.testnet', actions);
})();
```

## Dynamic annotations

The provider support the dynamic type annotation. [Learn more](./provider-core.md#dynamic-annotations)


