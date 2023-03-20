# @nearjs/provider-wallet-my-near-wallet

## Installation

```shell
npm i @nearjs/provider-wallet-my-near-wallet --save
```

```shell
yarn add @nearjs/provider-wallet-my-near-wallet
```

## Usage

Provides the full integration with MyNearWallet.
Extends [@nearjs/provider-core](./provider-core.md) - refer to the provider-core documentation for detailed manual

### Connect account

```typescript
import { BrowserKeyStore } from '@nearjs/browser-key-store';
import { ProviderMyNearWallet, getConfiguration } from '@nearjs/provider-wallet-my-near-wallet';


(async () => {
  // define keystore - the place where account key pairs are stored
  // you can provide any key store for your usecase: fs-key-store, in-memmory-keystore or browser one
  const keyStore = new BrowserKeyStore();

  // if you are using default RPC endpoints and 
  // default Near networks (testnet, betanet, mainnet), you can use 'getConfiguration' function provided with the package
  // otherwise you have to provide your own configuration object that extends MyNearWalletConfiguration interface
  const providerConfig = getConfiguration(Network.TESTNET, keyStore);

  // Instantiate MyNearWallet provider class
  const provider = new ProviderMyNearWallet(providerConfig);
  
  // this function should be called twice. 
  // The first call will open browser window that promts user login with your dApp
  // The second call will complete authorization. The second call should be called when user lands to the callback url after login.
  await provider.connectAccount({
    contractId: 'toxa.tokens.testnet',
    methodNames: ['ft_transfer']
  });
})();
```

#### Connect account options

You can ask user to login with limited access, 
to only your contract and defined methods on it by providing contract address and methodNames that app should be able to call on behalf of user.

```typescript
await provider.connectAccount({
    contractId: 'toxa.tokens.testnet',
    methodNames: ['ft_transfer']
  });
```

Also, you can request FullAccess key from the user to be able to send any rpc call to the blockchain on behalf of user:

```typescript
await provider.connectAccount({
    fullAccess: true
  });
```

### Sending transactions

```typescript
import { BrowserKeyStore } from '@nearjs/browser-key-store';
import { ProviderMyNearWallet, getConfiguration } from '@nearjs/provider-wallet-my-near-wallet';
import { FunctionCall } from '@nearjs/tx'

(async () => {
  // define keystore - the place where account key pairs are stored
  // you can provide any key store for your usecase: fs-key-store, in-memmory-keystore or browser one
  const keyStore = new BrowserKeyStore();

  // if you are using default RPC endpoints and 
  // default Near networks (testnet, betanet, mainnet), you can use 'getConfiguration' function provided with the package
  // otherwise you have to provide your own configuration object that extends MyNearWalletConfiguration interface
  const providerConfig = getConfiguration(Network.TESTNET, keyStore);
  
  const provider = new ProviderMyNearWallet(providerConfig);

  // Define actions to execcute. In this case we send 20 toxa tokens to toxa02.testnet address
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

Since MyNearWallet provides both: FullAccess and LimitedAccessKeys with network allowance your app can send direct RPC calls to the blockchain omitting opening wallet webpage.
Direct RPC calls can be executed only if:

- Your app has FullAccess key of the user
- Your app has LimitedAccessKey of the user, transaction does not require Near deposit to the transaction and there is enough network allowance to execute the transaction

MyNearWallet provider implements `sendTransactionSync` method in a way that it checks if it able to send direct RPC call and if it cannot it fallback to opening MyNearWallet window.

You can restrict library opening MyNearWallet webpage by providing `blockPopupFallback` option to the provider constructor

```typescript
import { BrowserKeyStore } from '@nearjs/browser-key-store';
import { ProviderMyNearWallet, getConfiguration } from '@nearjs/provider-wallet-my-near-wallet';
import { FunctionCall } from '@nearjs/tx'

(async () => {
  const keyStore = new BrowserKeyStore();

  const providerConfig = getConfiguration(Network.TESTNET, keyStore);
  providerConfig.blockPopupFallback = true; // prevent provider open MyNearWallet webpage

  const provider = new ProviderMyNearWallet(providerConfig);

  // Define actions to execcute. In this case we send 20 toxa tokens to toxa02.testnet address
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

  // this line throw an error because there is not FullAccess key provided for the user 'toxa.testnet'
  const result = await provider.sendTransactionSync('toxa.testnet', 'toxa.tokens.testnet', actions);
})();
```

In this case `sendTransactionSync` will throw an error if there is no FullAccessKey for the user or transaction require non-zero deposit to be attached

You might find this useful when you implement backend service/cronjobs/etc where opening browser window does not make sense.

### Account operation, view calls, query calls, etc...

Since MyNearWallet provider extends core NearRPCProvider it support the same functionality as that. [Learn more](./provider-core.md)
