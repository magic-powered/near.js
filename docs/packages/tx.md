# @nearjs/tx

## Installation

```shell
npm i @nearjs/tx --save
```

## Usage

### Transaction builder

The transaction itself is a complex object with a big amount of fields.
The tx package provides `TransactionBuilder` class which helps build transaction in easy, robust and typed way.

```typescript
import { TransactionBuilder, Transfer } from '@nearjs/tx';
import { KeyPair } from '@nearjs/keys';

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




