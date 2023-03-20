# @nearjs/browser-key-store

## Installation

```shell
npm i @nearjs/browser-key-store --save
```

```shell
yarn add @nearjs/browser-key-store
```

## About

The package provides implementation of KeyStore that can store KeyPair in browser local or session store

## Usage

```typescript
import {
  BrowserKeyStore
} from '@nearjs/browser-key-store';

(async () => {
  /**
   * Create the key store object
   */
  const keyStore = new BrowserKeyStore({
    storage: window.localStorage || window.sessionStorage // you can choose any storage you want
  });

  /**
   * Define the ID of the key
   */
  const keyId = new KeyId('account.near', 'mainnet');

  /**
   * Create new KeyPair and store in the store
   */
  const keyPair = KeyPair.fromRandom();
  await keyStore.addKeyByKeyIdString(keyId, keyPair);

  /**
   * Get existing KeyPair from the store
   */
  const existingKeyPair = await keyStore.getKeyPairByKeyId(keyId);
})();
```
