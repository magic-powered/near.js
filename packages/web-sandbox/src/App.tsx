import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ProviderMyNearWallet, getConfiguration, Network } from '@nearjs/provider-wallet-my-near-wallet';
import { BrowserKeyStore } from '@nearjs/browser-key-store';
import { FungibleToken } from '@nearjs/contracts';

function App() {
  const [count, setCount] = useState(0)

  const keyStore = new BrowserKeyStore();
  const provider = new ProviderMyNearWallet(getConfiguration(Network.TESTNET, keyStore));

  const connect = () => {
    // provider.connectAccount({ contractId: 'toxa.tokens.testnet' }).then(console.log).catch(console.error);
    provider.connectAccount({ fullAccess: true }).then(console.log).catch(console.error);
  }

  const token = new FungibleToken('toxa.tokens.testnet', provider);
  const send = () => {
    token.ftTransfer('toxa02.testnet', '1000000000000000000').then(console.log).catch(console.log);
  }

  const balance = () => {
    token.ftBalanceOf('toxa.testnet').then(console.log).catch(console.error);
  }

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Sandbox for near js</h1>
      <div className="card">
        <button onClick={connect}>
          count is {count}
        </button>
        <button onClick={send}>Send 1 token</button>
        <button onClick={balance}>Show balance</button>
      </div>
    </div>
  )
}

export default App
