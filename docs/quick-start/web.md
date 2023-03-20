# NearJS for frontend applications

This section describes how use NearJS with your frontend application to integrate with Near blockchain

## Installation 

```
$ npm install --save @nearjs/web
```

**@nearjs/web** package includes three essential packages:

- [@nearjs/account](../packages/account.md) - base library for account / encryption keys and access keys
- [@nearjs/browser-key-store](../packages/browser-key-store.md) - browser local or session storage wrapper for KeyPair storage 
- [@nearjs/provider-wallet-my-near-wallet](../packages/provider-wallet-my-near-wallet.md) - Near provider - provider Near API and MyNearWallet integration

## Example usage

```typescript
import { ProviderMyNearWallet, getConfiguration, Network, BrowserKeyStore } from '@nearjs/web'
import { useEffect, useState } from 'react';

export const MyNearComponent = ({
                                  contractId,
                                  methodNames
                                }) => {
  const [accountId, setAccountId] = useState(null);
  const [receiver, setReceiver] = useState(null);
  
  // create BrowserKeyStore - wrap around browser's localstorage
  const keyStore = new BrowserKeyStore();
  
  // create Near provider. Specify that we use testnet environment and our browser key store
  const provider = new ProviderMyNearWallet(getConfiguration(Network.TESTNET, keyStore));

  // Connect user's wallet account to your frontend application
  useEffect(() => {
    (async () => {
      // Check if account already connected
      const accountConnected = await provider.listConnectedAccounts();
      if (accountConnected.length) {
        return; // do not proceed if user already connected their account
      }

      // This will open MyNearWallet webpage that will ask user to approve login
      // This should be called second time after redirect user to the page to complete authentication.
      const connectedAccountId = await provider.connectAccount({ contractId, methodNames });
      setAccountId(connectedAccountId);
    })();
  }, [provider]);

  const send = async () => {
    // we need construct action object to let blockchain know what transaction it shoul execute
    const action = new FunctionCall(
      'ft_transfer', // smart contract method name: transfer token
      { // arguments
        receiver_id: receiverId, // token receiver
        amount: '1000000000000000000', // 1 token
      },
      300000000000000, // gas limit
      '1' // deposit (required for all ft transfer calls)
    );
    
    // Only FullAccess keys can send RPC calls directly.
    // If MyNearWallet provider finds fullaccess key it will call 
    // Near RPC endpoint directly with no additional wallet approval step.
    // Otherwise, if you operate with limitted access keys it will 
    // open MyNearWallet webpage and ask user to approve transaction.
    await this.provider.sendTransactionSync(
      accountId, // current user account 
      contractId, // address of token smart contract
      [action], // action to execute (ft_transfer)
    );
    
    alert('done!');
  }
  
  if (!accountId) {
    return (
      <div id="my-near-component">
        Please wait until you be redirected to the wallet for login...
      </div>
    );
  }

  return (
    <div id="my-near-component">
      <input onchange={setReceiver} />
      <button onClick={send}>Send 1 token</button>
    </div>
  );
}
```
