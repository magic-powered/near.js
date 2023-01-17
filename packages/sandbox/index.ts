import { FileSystemKeyStore } from '@nearjs/fs-key-store';
import { ProviderMyNearWallet } from '@nearjs/provider-wallet-my-near-wallet';
import { NonFungibleToken } from '@nearjs/contracts';

const iam = 'toxa.testnet';
const friend = 'toxa02.testnet';
const nftContract = 'toxa.mintspace2.testnet';

(async () => {
  const keyStore = new FileSystemKeyStore();

  const provider = new ProviderMyNearWallet({
    networkId: 'testnet',
    rpcUrl: 'https://rpc.testnet.near.org',
    keyStore,
    walletBaseUrl: 'https://testnet.mynearwallet.com',
    throwIfInsufficientAllowance: true,
    window: {} as any
  });

  const nft = new NonFungibleToken(nftContract, provider);
  const myTokens = await nft.nftTokensForOwner(iam);

  await nft.nftTransfer(friend, myTokens[0].token_id);

  const myFriendsTokens = await nft.nftTokensForOwner(friend);
})();

