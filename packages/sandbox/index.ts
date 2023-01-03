import {
  RPCProviderConfig,
  NearRPCProvider,
  StandardNodeUrls,
  ViewAccount,
} from "@near.js/provider-core";

const config = new RPCProviderConfig(StandardNodeUrls.TESTNET);

// const provider = new NearRPCProvider(config);

(async () => {
  const request = new ViewAccount('account.testnet');

  // const result = await provider.sendRPCRequest(request);


  // console.log(result);
})();

