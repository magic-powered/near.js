import {
  RPCProviderConfig,
  RPCProvider,
  ViewAccount,
  StandardNodeUrls, BroadcastTx,
} from '@near.js/provider-rpc';

const config = new RPCProviderConfig(StandardNodeUrls.TESTNET);

const provider = new RPCProvider(config);

(async () => {
  const result = await provider.sendRPCRequest(new BroadcastTx(undefined));

  result.


  console.log(result);
})();

