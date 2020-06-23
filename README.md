# \<package-name>

Describe this package. Delete the TypeScript Pkg README below.

## Actions


`yarn build` - Builds the package, emitting .js and .d.ts files\
`yarn lint` - Runs lint over the project source\
`yarn test` - Runs all tests under the src/ directory\
`yarn publish` - Bumps package version and publishes the package to Github Packages

## Toolchain

Uses [@brisberg/typescript-pkg](https://github.com/brisberg/typescript-pkg) as a template for Toolchain configuration.

See that repo for list of tools, documentation, and upgrade steps.

---
<!-- typescript-pkg specific README below -->

# TypeScript Pkg (Template)

Standard project configuration template for @brisberg TypeScript packages.

This is an opinionated toolchain configuration for TypeScript packages published to Github Packages.


## Usage

Add as a remote of your repository:
```bash
git remote add toolchain https://github.com/brisberg/typescript-pkg.git
```

Merge changes from toolchain template into your repository. Be sure to manually keep any project specific overrides:
```bash
git fetch toolchain
git merge toolchain/master --allow-unrelated-histories
# resolve merge conflicts, keeping project specific overrides and deletions
```

Often simply discard and regenerate lockfile:
```bash
rm yarn.lock
yarn install

```

## Tools

- [VSCode](https://code.visualstudio.com/) - Hackable IDE
- [TypeScript](https://www.typescriptlang.org/) - TypeScript language compiler
- [Yarn](https://yarnpkg.com/) - Package Manager of choice for node modules
- [Jest](https://jestjs.io/en/) - All-in-one test framework and assertion library
- [ESLint](https://eslint.org/) - Pluggable lint for Javascript/TypeScript
- [clang-format](https://clang.llvm.org/) - Code Formatting library

## CI

- [GitHub Actions](https://github.com/features/actions) - CI Pipelines hosted by GitHub

## Best Practices

- [Keep-a-Changelog](https://keepachangelog.com/en/1.0.0/) - Guide for maintaining a useful, readable Changelog.
