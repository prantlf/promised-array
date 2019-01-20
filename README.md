# PromisedArray

[![NPM version](https://badge.fury.io/js/promised-array.png)](http://badge.fury.io/js/promised-array)
[![Build Status](https://travis-ci.org/prantlf/promised-array.png)](https://travis-ci.org/prantlf/promised-array)
[![Coverage Status](https://coveralls.io/repos/github/prantlf/promised-array/badge.svg?branch=master)](https://coveralls.io/github/prantlf/promised-array?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a93e689283b447bfb8684f957f32ba50)](https://www.codacy.com/app/prantlf/promised-array?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=prantlf/promised-array&amp;utm_campaign=Badge_Grade)
[![devDependency Status](https://david-dm.org/prantlf/promised-array/dev-status.svg)](https://david-dm.org/prantlf/promised-array#info=devDependencies)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![NPM Downloads](https://nodei.co/npm/promised-array.png?downloads=true&stars=true)](https://www.npmjs.com/package/promised-array)

`PromisedArray` combines the interface of `Promise` and `Array`.

* It is a native `Promise`. You can use it in a promise chain and with the `await` operator.
* It includes all members of `Array.prototype`. They will apply to the array, which the promise resolves to and they return a promise to the result of the original method.
* Methods of `Array.prototype`, which expect callbacks, accept also asynchronous callbacks. They will wait, until the callback's promise resolves and continue with the result.
* No need to mark the callback by the `async` keyword, if they don't use teh `await` keyword and just return a promise.
* No dependencies on other modules.

**Warnig:** still in the development.

### Table of Contents

- [Synopsis](#synopsis)

## Synopsis

```js
// Print an array of names of items with the specified keys.
const keys = [1, 2, 3]
new PromisedArray(keys)
  .map(key => fetch('https://server.com/items/' + key))
  .map(response => response.json().name)
  .then(names => console.log(names))
  .catch(error => console.error(error))
````

## License

Copyright (c) 2019 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
