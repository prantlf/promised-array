PromisedArray
=============

`PromisedArray` combines the interface of `Promise` and `Array`.

* It is a native `Promise`. You can use it in a promise chain and with the `await` operator.
* It includes all members of `Array.prototype`. They will apply to the array, which the promise resolves to and they return a promise to the result of the original method.
* Methods of `Array.prototype`, which expect callbacks, accept also asynchronous callbacks. They will wait, until the callback's promise resolves and continue with the result.
* No need to mark the callback by the `async` keyword, if they don't use teh `await` keyword and just return a promise.

**Warnig:** still in the development.

Synopsis
--------

```js
// Print an array of names of items with the specified keys.
const keys = [1, 2, 3]
new PromisedArray(keys)
  .map(key => fetch('https://server.com/items/' + key))
  .map(response => response.json().name)
  .then(names => console.log(names))
  .catch(error => console.error(error))
````
