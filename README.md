# The Near-Magic-API-JS

A modern Javascript (and Typescript) library for Near blockchain integration.

## Library design charts

https://lucid.app/lucidchart/83b08aa7-9c7b-43d3-a19a-641dff3e4ee9/edit?viewport_loc=-41%2C-655%2C3072%2C1596%2CuxbUZxXg2iAi&invitationId=inv_36f37603-e422-4088-8094-157ffd664457

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
    │   └── package.json
    ├── cli
    │   └── package.json
    ├── constants
    │   └── package.json
    ├── contracts
    │   └── package.json
    ├── explorer
    │   └── package.json
    ├── helper
    │   └── package.json
    ├── providers
    │   └── package.json
    ├── rates
    │   └── package.json
    ├── units
    │   └── package.json
    ├── wallet-core
    │   └── package.json
    ├── wallet-providers
    │   └── package.json
    └── web
        └── package.json
```

### abstract-provider

Contains a part of the library with abstract classes for Near provider

### providers

Contains a part of the library with implementation of different providers:

- RPC API provider
- Stargate API provider
- Fast Near API provider 
- Pagoda API provider

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
- Sender wallet

### web

A frontend library for integration with a wallet

Implements: 
- localstorage keystore
- Wallet Connection
- Send transactions to the blockchain

Can be configured with different wallet-providers, near-providers.
Support multiple connections


