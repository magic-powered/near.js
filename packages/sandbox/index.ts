import {
  RPCProviderConfig,
  RPCProvider,
  StandardNodeUrls,
  ViewAccount,
} from '@near.js/provider-rpc';

const config = new RPCProviderConfig(StandardNodeUrls.TESTNET);

const provider = new RPCProvider(config);

(async () => {
  const request = new ViewAccount('account.testnet');

  const result = await provider.sendRPCRequest(request);


  console.log(result);
})();

