import { KeyId } from '@near.js/account';
import { FileSystemKeyStore } from '@near.js/fs-key-store';
import { ProviderMyNearWallet } from '@near.js/provider-wallet-my-near-wallet';
import { FunctionCall } from '@near.js/tx';

import BN from 'bn.js';

const accountId = 'toxa.testnet';
const keyId = new KeyId(accountId, 'testnet');
const tokenContract = 'toxa.tokens.testnet';

console.log();

(async () => {
  const keyStore = new FileSystemKeyStore();

  const provider = new ProviderMyNearWallet({
    keyStore,
    walletBaseUrl: 'https://testnet.mynearwallet.com',
    throwIfInsufficientAllowance: true,
    window: {} as Window,
    rpcUrl: 'https://rpc.testnet.near.org',
    networkId: 'testnet'
  });

  const actions = [
    new FunctionCall(
      'ft_transfer',
      {
        receiver_id: 'toxa02.testnet',
        amount: '200000000000000000000'
      },
      new BN(1),
      new BN(0)
    )
  ];

  try {
    const result = await provider.sendTransactionSync(accountId, tokenContract, actions);

    console.log(result);
  } catch (e) {
    const stringified = JSON.stringify(e, null ,2);
    console.log();
    console.log();
    console.log('============ error happened ============');
    console.log((stringified && stringified !== '{}') ? stringified : e);
    console.log('============ error happened ============');
    console.log();
    console.log();
  }
  console.log();
})();

