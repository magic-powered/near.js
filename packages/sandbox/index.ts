import {
  RPCProviderConfig,
  RPCProvider,
  StandardNodeUrls,
  BroadcastTx,
} from '@near.js/provider-rpc';

const config = new RPCProviderConfig(StandardNodeUrls.TESTNET);

const provider = new RPCProvider(config);

(async () => {
  const request = new BroadcastTx(undefined);

  const result = await provider.sendRPCRequest(request);

  console.log(result);
})();

