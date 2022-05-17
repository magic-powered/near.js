# The Near-Magic-API-JS

A modern Javascript (and Typescript) library for Near blockchain integration.

## Concepts

- provider - an entity that provides access to the Near blockchain.
- package - a separate package that can be installed to the app separately from other ones

## Packages

```text
├── LICENSE
├── README.md
├── package.json
└── packages
    ├── abstract-provider
    ├── cli
    ├── constants
    ├── contracts
    ├── explorer
    ├── helper
    ├── providers
    ├── rates
    ├── units
    ├── wallet-core
    ├── wallet-providers
    └── web
```

### abstract-provider

Contains a part of the library with abstract classes for Near provider

### providers

Contains a part of the library with implementation of different providers:

- RPC API provider
- Stargate API provider
- Fast Near API provider 

and others

### cli

Contains the Near cli tool to call Near blockchain via cli. Can be configured to use any provider.

### constants

Contains constants

### contracts

Contains necessary code to call view and write methods on the smart contracts. 
Contains contract factory and 

### explorer

Contains a helper objects to query data from near indexer for explorer database

### helper

Contains a helper objects to query near helper service (https://helper.mainnet.near.org)

### rates

Contains a helper objects to query current exchange rates for Near, Tokens, NFTs.
Includes Rates provider: (ref.finance, kitwallet.app, the-auction.io, binance, etc)

### units

Contains a helper objects to work with units: Yocto, Near, Gas, etc

### wallet-core

A library contains basic wallet abstractions: 

- Account entity
- Public Key handling
- Balance check
- etc

### wallet-providers

Contains different wallet API providers:

- Official near wallet
- Slender wallet

### web

A frontend library for integration with a wallet

Implements: 
- localstorage keystore
- Wallet Connection
- Send transactions to the blockchain

Can be configured with different wallet-providers, near-providers.
Support multiple connections


