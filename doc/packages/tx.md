# @near.js/tx

## Installation

```shell
npm i @near.js/tx --save
```

```shell
yarn add @near.js/tx
```

## Usage

The transaction itself is a complex object with a big amount of fields.
The tx package provides `TransactionBuilder` class which helps build transaction in easy, robust and typed way.

```typescript
import { TransactionBuilder, Transfer } from '@near.js/tx';
import { KeyPair } from '@near.js/keys';

const keyPair = KeyPair.fromRandom();

const transaction = TransactionBuilder.builder()
  .withNonce(1)
  .addAction(new Transfer(100))
  .withReceiverId('receiver.testnet')
  .withSignerId('signer.testnet')
  .withPublicKey(keyPair.getPublicKey())
  .build();

const signedTransaction = keyPair.sign(transaction.toBorsh());
```




