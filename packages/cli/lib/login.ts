import { KeyId, KeyPair, KeyStore } from '@nearjs/account';
import { ProviderMyNearWallet, AUTH_ID_URL_QUERY_PARAM } from '@nearjs/provider-wallet-my-near-wallet';
import open from 'open';
import { RedirectHandler } from './redirect-handler';

export const login = async (provider: ProviderMyNearWallet, keyStore: KeyStore) => {
  const redirectHandler = new RedirectHandler(['accountId', AUTH_ID_URL_QUERY_PARAM]);
  const keyPair = KeyPair.fromRandom();

  const loginLink = provider.constructLoginLink(
    'cli-auth',
    { fullAccess: true, callbackUrl: redirectHandler.getHandlerUrl() },
    keyPair.getPublicKey().toString(),
  );

  redirectHandler.setRedirectUrl(loginLink);

  await redirectHandler.start();

  try {
    await open(loginLink);
  } catch (e) {
    await redirectHandler.stop();
    throw e;
  }

  const authParams = await redirectHandler.listenForRedirectParams();

  if (!authParams.has(AUTH_ID_URL_QUERY_PARAM)) {
    throw new Error('Failed to fetch auth info.');
  }

  if (authParams.get(AUTH_ID_URL_QUERY_PARAM) !== 'cli-auth') {
    throw new Error('Failed to fetch auth info.');
  }

  const accountIdParameter = authParams.get('accountId');

  if (!accountIdParameter) {
    throw new Error('Failed to fetch auth info.');
  }

  if (Array.isArray(accountIdParameter) && !accountIdParameter.length) {
    throw new Error('Failed to fetch auth info');
  }

  const accountId = Array.isArray(accountIdParameter) ? accountIdParameter[0] : accountIdParameter;

  const keyId = new KeyId(accountId, provider.getNetworkId());

  await keyStore.addKeyByKeyId(keyId, keyPair);

  await provider.fetchAccessKey(accountId);

  return accountId;
};
