# Overview

This repository describes a custom NodeJs TypeScript project template, that can be used to start a new project with the proper configuration very quickly.

# Project Structure
The project structure is as follows :
```
├── coverage/             [gitignored] Test coverage reports
├── dist/                 [gitignored] JavaScript compiled files
│   ├── index.js          Main project file
│   ├── index.d.ts        Main type definition file
│   ├── index.js.map      Main source map file
│   └── ...
├── node_modules/         [gitignored] Node modules
├── spec/                 TypeScript tests files
├── src/                  TypeScript source files
│   ├── logger/           Bunyan logger instanciation
│   │   └── ...
│   ├── index.ts          Main source file
│   └── ...
├── .eslintcache          [gitignored] ESLint cache
├── .eslintignore         Files ignored by ESLint
├── .eslintrc.json        ESLint configuration file
├── .gitattributes        Git EOL normalization and diff configuration patterns
├── .gitignore            Files ignored by GIT
├── .npmignore            Files ignored by NPM (for publishing)
├── .npmrc                NPM configuration file
├── .prettierignore       Files ignored by Prettier
├── .prettierrc.json      Prettier configuration file
├── jest.config.js        Jest configuration file
├── package.json          Project package.json
├── package-lock.json     Package lock (can be removed to update dep versions)
├── README.md             README of the repo
├── tsconfig.json         TypeScript project configuration file
└── tsconfig.eslint.json  TypeScript configuraiton file for the ESLint parser
```

# Features
## TypeScript
This project uses [TypeScript](https://www.typescriptlang.org/) for source files. The project configuration is available in the `/tsconfig.json` file. Compiled JavaScript file are generated in the `/dist` directory. Type declarations and source map files generation are enabled.

## Logger
A [Bunyan](https://www.npmjs.com/package/bunyan) logger is included in this project. The logger configuration can be edited in `/src/logger/logger.ts`. Code snipplet to use the logger :
```TypeScript
import logger from './logger';

logger.info('Hello world!');
```

## Lint
This project uses an [ESLint](https://eslint.org/) linter, along with [Prettier](https://prettier.io/) to format the code. The ESLint rules are based on the [Airbnb Eslint Config](https://www.npmjs.com/package/eslint-config-airbnb), and implements several other configs on top such as :
- `@typescript-eslint/recommended`
- `@typescript-eslint/recommended-requiring-type-checking`
- `promise/recommended`
- `prettier`
- `@typescript-eslint`

The Jest plugin is also installed to allow Jest and ESLint to work together properly.

To run a lint check, use the following command :
> `npm run lint`

To automatically fix linting errors, run the following command :
> `npm run lint:fix`

## Test
[Jest](https://jestjs.io/) is the testing framework used in this project. The framework is used with the [ts-jest](https://www.npmjs.com/package/ts-jest) to allow the writing and execution of tests in TypeScript without compilation.

Jest will execute every test file located in the `/spec` directory and ending with `.spec.ts`. The coverage report is generated in the LCOV format, and located in the `/coverage` directory.

To run the tests, use the following command :
> `npm run test`

To run the tests and generate a coverage report, use the following command :
> `npm run test:coverage`
