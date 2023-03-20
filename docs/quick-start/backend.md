# NearJS for backend applications

This section describes how use NearJS with your backend application to integrate with Near blockchain

## Installation

```
$ npm install --save @nearjs/backend
```

**@nearjs/backend** package includes three essential packages:

- [@nearjs/account](../packages/account.md) - base library for account / encryption keys and access keys
- [@nearjs/fs-key-store](../packages/fs-key-store.md) - file system storage wrapper for KeyPair storage
- [@nearjs/provider-core](../packages/provider-core) - Near provider - provide Near API client

you can extend your setup with any other package you might need by simple installation them into your app 

## Example usage

You backend application should have full access key to be able to perform transactions to the Near Blockchain.

By default, FileSystemKeyStore expect `~/.near-keys` folder where key pair files are stored.
All key pairs from the folder will be automatically loaded to the provider and will be used to sign transactions.

```typescript
import { NearRPCProvider, testnetRPCConfig, FileSystemKeyStore } from '@nearjs/bakend';

(async () => {
  // Define that our keys are stored in file system
  const keyStore = FileSystemKeyStore();
  // Construct provider configuration
  const config = testnetRPCConfig(keyStore);
  // Construct RPC Provider
  const provider = new NearRPCProvider(config);

  // returns public key for provided user. Return null if no key found
  const publicKey = await provider.getPublicKey('my.account.testnet');

  // Define actions to execcute. In this case we send 20 tokens to toxa02.testnet address
  const action =
    new FunctionCall(
      'ft_transfer',
      {
        receiver_id: 'toxa02.testnet',
        amount: '200000000000000000000'
      },
      1, // gas limit
      1 // attached Near deposit
    );
  
  const sender = 'toxa.testnet';
  const tokenContractAddress = 'toxa.tokens.testnet';

  // send transaction
  const result = await provider.sendTransactionSync(sender, tokenContractAddress, [action]);
})();
```

However, it is not required to provide any keys or keystore to use Near RPC API and API Provider. If you not configure key store or not configure key pair files in the store you still able to send all RPC requests excluding transactions.

```typescript
import { NearRPCProvider, testnetRPCConfig, ViewAccessKey, ViewAccount } from '@nearjs/provider-core';
import { FileSystemKeyStore } from '@nearjs/fs-key-store';

(async () => {
  // testnet configuration without key store
  const config = testnetRPCConfig();

  // provide configuration to the provider constructor without key store
  // provider now works in readonly mode
  const provider = new NearRPCProvider(config);

  // Build ViewAccount query
  const viewAccount = new ViewAccount('my.account.testnet');
  // send query 
  const account = await provider.sendRPCRequest(viewAccount);
})();
```

[Learn more](../packages/provider-core.md) about more use cases in @nearjs/provider-core documentation page  
