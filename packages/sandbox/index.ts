import { FileSystemKeyStore } from '@nearjs/fs-key-store';
import { NearRPCProvider, testnetRPCConfig } from '@nearjs/provider-core';
import { NonFungibleToken } from '@nearjs/contracts';

const iam = 'toxa.testnet';
const friend = 'toxa02.testnet';
const nftContract = 'toxa.mintspace2.testnet';

(async () => {
  const keyStore = new FileSystemKeyStore();

  const provider = new NearRPCProvider(testnetRPCConfig(keyStore));

  console.log(await provider.listConnectedAccounts());
})();
