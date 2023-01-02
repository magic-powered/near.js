# Near.js contributing guide

## Getting started

Following steps describes how to setup the Near.js repository on your local machine

### Setup

The following tools need to be installed on your system prior to installing the Near.js:

"node": ">=16.14.0",
"pnpm": ">=7"

- [NodeJS >=16.14.0](https://nodejs.org/download/release/latest-v16.x/)
- [PNPM >=7](https://pnpm.io/installation)

```shell
git clone git@github.com:magic-powered/near.js.git
cd near.js
pnpm i
```

### Repo structure

The Near.js is a NPM project written in typescript. More specifically, it is a [monorepo managed using pnpm](https://pnpm.io/workspaces). If you're unfamiliar with any of these technologies, it is useful to learn about them and will make understanding the Near.js codebase easier but strictly not necessary for simple contributions.

The repo contains packages/ directory that contains the Near.js public modules. 
The source code for the provider-rpc API in the Near.js can be found at the location packages/provider-rpc.

### Pull Requests

**Step 1**: Find something to work on

You can find out many issues posted by the community to the [Issues](https://github.com/magic-powered/near.js/issues) tab of the repository.

Choose one by assigning it on your self.

**Step 2**: Fork the repository

Public contributors are not allowed to push anything to the Near.js repository.
To start your contributing you should fork the repo and work inside your own sandbox.

**Step 3**: Do the code magic

Implement your changes. Make sure your changeset comply with the following rules:

1. You code clean, readable and complete.
2. You do not introduce TODO comments.
3. Your code is covered by unit tests.
4. Your code is covered with JSDoc annotations
5. Your code is covered with all necessary guides, manuals and explanations in `./docs` folder

**Step 4**: Push your changes and create Pull Request

Once you're done you may push your code and create the Pull Request.
You should not worry about squashing your changes, the Github can do it for you once PR is approved and merged.

**Step 4.1**: Formatting your PR

- Make sure PR title is meaningful.
- Make sure your PR description is meaningful and reviewer can understand what you did by just reading the description.
- Make sure your PR is linked to the issue you want to address.
- Assign suggested people to review. Assign original issue author as a reviewer.





