// import {
//   RPCProviderConfig,
//   RPCProvider,
//   StandardNodeUrls,
//   ViewAccount,
// } from '@near.js/provider-rpc';
//
// const config = new RPCProviderConfig(StandardNodeUrls.TESTNET);
//
// const provider = new RPCProvider(config);
//
// (async () => {
//   const request = new ViewAccount('account.testnet');
//
//   const result = await provider.sendRPCRequest(request);
//
//   result.result.
//
//   console.log(result);
// })();
//

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
