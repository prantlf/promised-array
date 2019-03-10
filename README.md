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
* Callback execution possible either sequentially or concurrently.
* No dependencies on other modules.

**Warnig:** still in the development.

### Table of Contents

- [Synopsis](#synopsis)
- [Description](#description)

## Synopsis

```js
// Print an array of names of items with the specified keys.
new PromisedArray([1, 2, 3])
  .map(key => fetch('https://server.com/items/' + key))
  .map(response => response.json().name)
  .then(names => console.log(names))
  .catch(error => console.error(error))
````

## Description

`PromisedArray` is a function object with the prototype combined from
`Promise` and `Array`. Instances can be constructed either from an array
or from a promise resolving to an array.

```js
// Print names of all items.
const promise = fetch('https://server.com/items')
  .then(response => response.json())
PromisedArray
  .fromPromise(promise)
  .forEach({ name } => console.log(name))
  .catch(console.error)
```

Methods of the `PromisedArray` prototype, which share their names with
their corresponding methods of the original `Array` prototype, have the
same semantics and guarantees the same order of processing array items.
They return the same result, only wrapped in a `PromisedArray` instance,
if it is an array, or in a stqndqrd promise in other cases.
Methods, which accept callbacks as parameters, check, if the result of
the callback is a promise or not. If it is, they wait for its resolution
and continue with the result. If the promise gets rejected, the whole
result promise will be rejected and the loop over array items aborted.

Methods which end with `Concurrently` execute callbacks for every array
item concurrently and wait for resulution of all promises for callback
call results, before they process the results. The order callback
execution may differ from the original method from the `Array` prototype.
If the method returns an array, order of results in that array is guaranteed
to be the same as the original method from the `Array` prototype would
return.

## License

Copyright (c) 2019 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
