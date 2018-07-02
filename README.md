# EE-JS Utility library for Cocos Creator

[![npm version](https://img.shields.io/npm/v/@senspark/ee.svg)](https://www.npmjs.com/package/@senspark/ee)

## Prerequisite

- Install [brew](https://brew.sh/)
- Install node.js: `brew install node`

## Installation

- Project directory structure:

```
project-dir
├─── assets
├─── node_modules
├─── packages
...
```

- Install @senspark/ee: `npm install @senspark/ee@latest`
- Create a symbolic link to source files: `ln -s ./../node_modules/@senspark/ee/src ./assets/ee` (Can be changed depends on your project hierarchy)
- Create a symbolic link to package files (for inspectors): `ln -s ./../node_modules/@senspark/ee/packages ./packages/ee`

## Features

#### NestedPrefab

- Use this component as an alternative to nested prefabs which is not supported in Cocos Creator.

#### HsvComponent

- Provide Hue/Saturation/Value adjustment for sprites.

#### LanguageComponent/LanguageManager

- Provide multilingual features.

#### Cocos2dFwd

- Declare classes for TypeScript.