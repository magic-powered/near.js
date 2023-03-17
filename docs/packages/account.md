# @nearjs/account

## Installation

```shell
npm i @nearjs/account --save
```

```shell
yarn add @nearjs/account
```

## About

The package provides several tools helping manage users keys and key pairs

```
.
├── index.ts
├── lib
│   ├── keys
│   │   ├── access-key.ts
│   │   ├── index.ts
│   │   ├── key-pair.ts
│   │   └── keys.ts
│   └── keys-store
│       ├── index.ts
│       ├── inmemory-key-store.ts
│       └── keys-store.ts
├── package.json
└── tsconfig.json
```

### Keys

Contains several classes that manages users keys:

- Access Key - The user's [access key](https://docs.near.org/concepts/basics/accounts/access-keys)
- Keys - Implements Public and Private keys representation
- Key Pair - Container or storage for Public and Private keys pair and access keys

### Keys store

Provides base abstract key store interface for all further implementations of keys stores: fs, browser, inmemmory, etc...
Includes in-memmory key store 

#### Usage

```typescript
import {
  InMemoryKeyStore, KeyId, KeyPair
} from '@nearjs/account';

(async () => {
  /**
   * Create the key store object
   */
  const keyStore = new InMemoryKeyStore();

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
