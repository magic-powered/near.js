# NearJS for cli applications

This section describes how use NearJS with your cli application to integrate with Near blockchain

## Installation

```
$ npm install --save @nearjs/cli
```

**@nearjs/cli** package includes three essential packages:

- [@nearjs/account](../packages/account.md) - base library for account / encryption keys and access keys
- [@nearjs/fs-key-store](../packages/fs-key-store.md) - file system storage wrapper for KeyPair storage
- [@nearjs/provider-my-near-wallet](../packages/provider-my-near-wallet) - Near provider - provide Near API client and MyNearWallet integration

you can extend your setup with any other package you might need by simple installation them into your app

## Example

**@nearjs/cli** package provides all necessary modules and classes aimed to hel developers build their own cli tools.

```typescript
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as figlet from "figlet";
import { mainnetRPCConfig } from '@nearjs/cli';

const program = new Command();

console.log(figlet.textSync("NEAR Token Console"));

program
  .version("1.0.0")
  .description("An example CLI for sending tokens in Near Blockchain")
  .option("-t, --token  <value>", "Smart contract address")
  .option("-a, --amount <value>", "Amount of tokens to send")
  .option("-r, --receiver <value>", "Token receiver address")
  .option("-s, --sender <value>", "Token sender address. Account should be connected")
  .option("-n, --network <value>", "Near network ID: testnet or mainnet")
  .parse(process.argv);

const options = program.opts();

(async () => {
  // Define that our keys are stored in file system
  const keyStore = FileSystemKeyStore();
  // Construct provider configuration based on provided input
  const config = options.network === 'mainnet' ? mainnetRPCConfig(keyStore) : testnetRPCConfig(keyStore);
  // Construct RPC Provider
  const provider = new NearRPCProvider(config);

  // returns public key for provided user. Return null if no key found
  const publicKey = await provider.getPublicKey(options.sender);

  // Define actions to execcute. In this case we send 20 tokens to toxa02.testnet address
  const action =
    new FunctionCall(
      'ft_transfer',
      {
        receiver_id: options.receiver,
        amount: options.amount
      },
      3000000000, // gas limit
      1 // attached Near deposit
    );

  const sender = options.sender;
  const tokenContractAddress = options.token;

  // send transaction
  const result = await provider.sendTransactionSync(sender, tokenContractAddress, [action]);
})();
```

## Connecting account and receiving access keys

In order to authenticate with your account you can use `login` function provided by the package:

```typescript
import { Command } from "commander";
import * as figlet from "figlet";
import { FileSystemKeyStore, getConfiguration, login, Network, ProviderMyNearWallet } from '@nearjs/cli';

const program = new Command();

console.log(figlet.textSync("NEAR Token Console"));

program
  .version("1.0.0")
  .description("An example CLI for sending tokens in Near Blockchain")
  .command('login')
  .action(async () => {
    // Define that our keys are stored in file system
    const keyStore = new FileSystemKeyStore();
    // Construct provider configuration based on provided input
    const config = getConfiguration(Network.TESTNET, keyStore);
    // Construct RPC Provider
    const provider = new ProviderMyNearWallet(config);

    const accountId = await login(provider, keyStore);

    console.log(`Welcome, ${accountId}!`);
  })
  .parse(process.argv);
```
