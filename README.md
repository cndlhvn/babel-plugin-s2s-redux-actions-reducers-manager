# babel-plugin-s2s-redux-actions-reducers-manager

> manage redux actions reducers

## Install

```
$ yarn add --dev babel-plugin-s2s-redux-actions-reducers-manager
```

## Dependency

This plugin is dependent on babel-plugin-s2s-action-builders, babel-plugin-s2s-redux-actions-reducers and babel-plugin-s2s-redux-actions-reducers-root.

Please prepare these plugins before using this plugin.

[https://github.com/cndlhvn/babel-plugin-s2s-action-builders](https://github.com/cndlhvn/babel-plugin-s2s-action-builders)

[https://github.com/cndlhvn/plugin-s2s-redux-actions-reducers](https://github.com/cndlhvn/plugin-s2s-redux-actions-reducers)

[https://github.com/cndlhvn/babel-plugin-s2s-redux-actions-reducers-root](https://github.com/cndlhvn/babel-plugin-s2s-redux-actions-reducers-root)

## Solve object rest spread
This plugin generates code containing "object rest spread" from ast. \
At that time, an error occurs in babel 6.

Looking at the code of s2s.config.js, other plugins can solve it by handling s2s-handler-babel-object-rest-spread. \
This plugin adopted a more tricky method and could not be solved from s2s handler.

However, the solution is simple. \
First, install babel-plugin-syntax-object-rest-spread.

```
yarn add --dev babel-plugin-syntax-object-rest-spread
```

Next, create a `.babelrc` file and write it.

```js
{
  "plugins": ["syntax-object-rest-spread"]
}
```

## s2s.config.js

s2s-redux-actions-reducers-manager plugin watch the `src/builders/*.js` files.

```js
const handlerBabelSpread = require('s2s-handler-babel-object-rest-spread').default

module.exports = {
  watch: './**/*.js',
  plugins: [
    {
      test: /src\/reducers\/(?!.*index).*\.js/,
      handler: handlerBabelSpread,
      plugin: ['s2s-redux-actions-reducers',{autocomplete: false}]
    },
    {
      test: /src\/reducers\/(?!.*index).*\.js/,
      output: "index.js",
      handler: handlerBabelSpread,
      plugin: ['s2s-redux-actions-reducers-root',
      { input: 'src/reducers/*.js', output: "src/reducers/index.js",router: true }]
    },
    {
      test: /src\/builders\/.*\.js/,
      plugin: ['s2s-redux-actions-reducers-manager',
      { input: 'src/builders/*.js', output: "src/reducers/*.js" }]
    }
  ],
  templates: [
    {
      test: /src\/reducers\/.*\.js/, input: 'reducer.js'
    }
  ]
}
```
## Start s2s

Start the s2s with yarn command

```
yarn run s2s
```

## Usage

#### When create a builder file

When you create a `src/builders/*.js`, this plugin creates `src/reducers/*.js` as a same name. \
For example, you create a `src/builders/user.js`, then it creates a `src/reducers/user.js`

#### Write action name

#### In:

In the builder file, write action name with camelcase such as `getPokemonRequest` and save it.

`src/builders/pokemon.js`
```js
getPokemonRequest
```

It will be expanded like this.

#### Out:

`src/builders/pokemon.js`
```js
let getPokemonRequest;
let getPokemonSuccess;
let getPokemonFailure;
```

`src/reducers/pokemon.js`
```js
import { handleActions } from "redux-actions";
import * as actions from "../actions";

const initialState = {};

export default handleActions(
  {
    [actions.getPokemonRequest]: (state, action) => ({
      ...state
    }),
    [actions.getPokemonSuccess]: (state, action) => ({
      ...state
    }),
    [actions.getPokemonFailure]: (state, action) => ({
      ...state
    })
  },
  initialState
);
```

#### Remove action name

If you remove the "action name" written in the `src/builders/*.js` file, "action name" is removed from the file with the same name in `src/reducers/`.

# Test

This plugin has two test files. \
First is babel plugin main test file named `test.js` on root directory. \
Next is a `test/index.js` that will be transformed by the plugin.

Run this command.

` npm run test`

Test will run and you can see what happen.

If you modify the target javascript source code, please change the `test/index.js`.
