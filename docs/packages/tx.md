# @nearjs/tx

## Installation

```shell
npm i @nearjs/tx --save
```

## Usage

**@nearjs/tx** package provides necessary classes and builders to build transactions that can be sent to the RPC API using [RPC provider](./provider-core.md)

### Actions

Action is an object in Near RPC API that defines what exactly transaction should execute. There is a [different types of actions](https://nomicon.io/RuntimeSpec/Actions).

#### Action builder 

Each action is represented as a simple class that can be build by calling it's constructor:

```typescript
import { Transfer } from '@nearjs/tx';

const amountToTransferInYoctoNear = 1000000000000;

const transferNearAction = new Transfer(amountToTransferInYoctoNear);
```

```typescript
import { FunctionCall } from '@nearjs/tx';

const callFunctionAction = new new FunctionCall(
  'ft_transfer', // smart contract method name: transfer token
  { // arguments
    receiver_id: receiverId, // token receiver
    amount: '1000000000000000000', // 1 token
  },
  300000000000000, // gas limit
  '1' // deposit (required for all ft transfer calls)
);
```

@nearjs/tx support all actions that [supported by Near RPC API](https://nomicon.io/RuntimeSpec/Actions)

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

It is possible to add multiple actions to the transaction using builder. There are two ways doing that:

```typescript
import { Stake, TransactionBuilder, Transfer } from '@nearjs/tx';
import { KeyPair } from '@nearjs/keys';

const keyPair = KeyPair.fromRandom();

const transactionBuilder = TransactionBuilder.builder()
  .withNonce(1)
  .withReceiverId('receiver.testnet')
  .withSignerId('signer.testnet')
  .withPublicKey(keyPair.getPublicKey());

// append actions to the builder object one by one
transactionBuilder.addAction(new Transfer(100));
transactionBuilder.addAction(new Stake(100, keyPair.getPublicKey()));

const signedTransaction = keyPair.sign(transactionBuilder.build().toBorsh());
```

```typescript
import { TransactionBuilder, Transfer } from '@nearjs/tx';
import { KeyPair } from '@nearjs/keys';

const keyPair = KeyPair.fromRandom();

const transactionBuilder = TransactionBuilder.builder()
  .withNonce(1)
  .withReceiverId('receiver.testnet')
  .withSignerId('signer.testnet')
  .withPublicKey(keyPair.getPublicKey());

// append actions to the builder object all at once
transactionBuilder.addActions([new Transfer(100), new Stake(100, keyPair.getPublicKey())])

const signedTransaction = keyPair.sign(transactionBuilder.toBorsh());
```
