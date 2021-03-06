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
- Create a symbolic link to source files: `ln -s ./../node_modules/@senspark/ee/src/utils ./assets/ee` (Can be changed depends on your project hierarchy)
- Create a symbolic link to package files (for inspectors): `ln -s ./../node_modules/@senspark/ee/packages ./packages/ee`
- Modify `tsconfig.json` to fix compile errors in VS Code:

```json
{
  "include": [
    "node_modules/@senspark/ee/src"
  ]
}
```

- Modify `.gitignore` to keep `.meta` files (generated by Cocos Creator):

```
node_modules/**
!node_modules/**/
!node_modules/**/*.meta
```

## Features

### NestedPrefab

- Use this component as an alternative to nested prefabs which is not supported in Cocos Creator.

### HsvComponent

- Provide Hue/Saturation/Value adjustment for sprites.

### LanguageComponent/LanguageManager

- Provide multilingual features.

### Cocos2dFwd

- Declare classes for TypeScript.