import * as nearAPI from "near-api-js";

const { keyStores } = nearAPI;
const homedir = require("os").homedir();
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const { connect } = nearAPI;

(async () => {
  const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore, // first create a key store
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  const nearConnection = await connect(connectionConfig);

  const account = await nearConnection.account('toxa.testnet');

  const { Contract } = nearAPI;

  const contract = new Contract(account, 'toxa.tokens.testnet', {
    changeMethods: ["ft_transfer"],
    viewMethods: []
  });
// `contract` object has `my_method` on it:
  // @ts-ignore
  const result = await contract.ft_transfer({
    receiver_id: 'toxa02.testnet',
    amount: '200000000000000000'
  }, 1, 1);

  console.log(result);
})();



