# @near.js/fs-key-store

## Installation

```shell
npm i @near.js/fs-key-store --save
```

```shell
yarn add @near.js/fs-key-store
```

## About

The package provides implementation of KeyStore that can store KeyPair in the local filesystem

## Usage

```typescript
import {
  BrowserKeyStore
} from '@near.js/fs-key-store';

(async () => {
  /**
   * Create the key store object
   */
  const keyStore = new FileSystemKeyStore();

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

By default, the KeyStore will persist your keys in `.near-keys` folder inside your HOME directory
