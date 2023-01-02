# Packages

| Name                                                | Description                                                                                                   |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| @near.js/config                                     | Config package provides necessary tools and features to keep your near related config nice and clean.         |
| @naer.js/keys                                       | Everything keys related: Access keys, key pair controller, private and public key.                            |
| @near.js/keystore                                   | Keystore implementations: FS store, Browser local store, inmemmory store.                                     |
| @near.js/provider-core                              | Abstract provider class. Used when developer need to implement custom near api provider.                      |
| [@near.js/provider-rpc](./packages/provider-rpc.md) | Near RPC API provider. Used to send commands and requests to the NEar blockchain using standard RPC Near API. |
| @near.js/provider-wallet-core                       | Abstract wallet provider class and interfaces. Needed to implement custom wallet providers.                   |
| @near.js/provider-wallet-my-near-wallet             | Integration with MyNearWallet.                                                                                |
| @near.js/provider-wallet-sender                     | Integration with Sender wallet.                                                                               |
| [@near.js/tx](./packages/tx.md)                     | Provides typed transaction builder.                                                                           |

Each package includes typescript typings. Can be used for both: javascript and typescript code.
