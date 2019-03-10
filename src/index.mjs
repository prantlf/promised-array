// Original `Array` prototype
const arrayPrototype = Array.prototype

// Methods of the `PromisedArray` prototype, which share their names with
// their corresponding methods of the original `Array` prototype, have the
// same semantics and guarantees the same order of processing array items.
// They return the same result, only wrapped in a `PromisedArray` instance,
// if it is an array, or in a stqndqrd promise in other cases.
// Methods, which accept callbacks as parameters, check, if the result of
// the callback is a promise or not. If it is, they wait for its resolution
// and continue with the result. If the promise gets rejected, the whole
// result promise will be rejected and the loop over array items aborted.

// Methods, which accept callbacks as parameters, need asychronous handling
// of the callbacks. Those, which return an array, have that array wrapped
// in `PromisedArray` and continue chaining of all `PromisedArray` method
// calls.
const promisedArrayPrototype = {
  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one. As soon as the first result is not
  // truthy, this method will return a promise resolving to `false`.
  // Otherwise it will return a promise resolving to `true`.
  every (callback, context) {
    return this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        if (!await callback.call(context, array[i], i, array)) {
          return false
        }
      }
      return true
    })
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one. If the result is truthy, the item
  // will be remembered. At the end, an extended promise will be returned
  // to an array of all remembered array items.
  filter (callback, context) {
    const promise = this.then(async function (array) {
      const filteredArray = []
      for (let i = 0, length = array.length; i < length; ++i) {
        const item = array[i]
        if (await callback.call(context, item, i, array)) {
          filteredArray.push(item)
        }
      }
      return filteredArray
    })
    return PromisedArray.fromPromise(promise)
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one. As soon as the first result is
  // truthy, this method will return a promise resolving to the array item.
  // Otherwise it will return a promise resolving to `undefined`.
  find (callback, context) {
    return this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        const item = array[i]
        if (await callback.call(context, item, i, array)) {
          return item
        }
      }
    })
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one. As soon as the first result is
  // truthy, this method will return a promise resolving to the index of
  // that array item. Otherwise it will return a promise resolving to `-1`.
  findIndex (callback, context) {
    return this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        if (await callback.call(context, array[i], i, array)) {
          return i
        }
      }
      return -1
    })
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one. It will return an extended promise
  // resolving to the original array.
  forEach (callback, context) {
    const promise = this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        await callback.call(context, array[i], i, array)
      }
      return array
    })
    return PromisedArray.fromPromise(promise)
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one. It will return an extended promise
  // resolving to an array of the resolved callback results.
  map (callback, context) {
    const promise = this.then(async function (array) {
      const result = new Array(array.length)
      for (let i = 0, length = array.length; i < length; ++i) {
        result[i] = await callback.call(context, array[i], i, array)
      }
      return result
    })
    return PromisedArray.fromPromise(promise)
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one. It will return a promise for an
  // accumulated result returned by the last callback call.
  reduce (callback, result, context) {
    return this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        result = await callback.call(context, result, array[i], i, array)
      }
      return result
    })
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one, going from the last item downto the
  // first one. It will return a promise for an accumulated result returned
  // by the last callback call.
  reduceRight (callback, result, context) {
    return this.then(async function (array) {
      for (let i = array.length; --i >= 0;) {
        result = await callback.call(context, result, array[i], i, array)
      }
      return result
    })
  },

  // Iterates over every item in the array, one by one. If the item is a
  // promise, it will wait for its resolution. Eventually it will return
  // a promise resolving to an array of all resolved items.
  resolve () {
    const promise = this.then(async function (array) {
      const result = new Array(array.length)
      for (let i = 0, length = array.length; i < length; ++i) {
        result[i] = await array[i]
      }
      return result
    })
    return PromisedArray.fromPromise(promise)
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, one by one. As soon as the first result is
  // truthy, this method will return a promise resolving to `true`.
  // Otherwise it will return a promise resolving to `false`.
  some (callback, context) {
    return this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        if (await callback.call(context, array[i], i, array)) {
          return true
        }
      }
      return false
    })
  },

  // Methods, which execute callbacks for every array item concurrently
  // and wait for resulution of all promises for callback call results,
  // before they process the results. The order callback execution may
  // differ from the original method from the `Array` prototype. If the
  // method returns an array, order of results in that array is guaranteed
  // to be the same as the original method from the `Array` prototype would
  // return.

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, iterating over them concurrently. When all
  // are processed, if all results are truthy, this method will return
  // a promise resolving to `true`. Otherwise it will return a promise
  // resolving to `false`.
  everyConcurrently (callback, context) {
    return this.then(async function (array) {
      const promises = array.map(callback, context)
      const results = await Promise.all(promises)
      for (let i = 0, length = results.length; i < length; ++i) {
        if (!results[i]) {
          return false
        }
      }
      return true
    })
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, iterating over them concurrently. When all
  // are processed, items, for which the callback results were truthy, will
  // be remembered. At the end, an extended promise will be returned
  // for an array of all remembered array items.
  filterConcurrently (callback, context) {
    const promise = this.then(async function (array) {
      const promises = array.map(callback, context)
      const results = await Promise.all(promises)
      const filteredArray = []
      for (let i = 0, length = results.length; i < length; ++i) {
        if (results[i]) {
          filteredArray.push(array[i])
        }
      }
      return filteredArray
    })
    return PromisedArray.fromPromise(promise)
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, iterating over them concurrently. When all
  // are processed and just one result is truthy, this method will return
  // a promise resolving to the array item. Otherwise it will return a
  // promise resolving to `undefined`.
  findConcurrently (callback, context) {
    const promise = this.then(async function (array) {
      const promises = array.map(callback, context)
      const results = await Promise.all(promises)
      for (let i = 0, length = results.length; i < length; ++i) {
        if (results[i]) {
          return array[i]
        }
      }
    })
    return PromisedArray.fromPromise(promise)
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, iterating over them concurrently. When all
  // are processed and just one result is truthy, this method will return
  // a promise resolving to the index of that array item. Otherwise it will
  // return a promise resolving to `-1`.
  findIndexConcurrently (callback, context) {
    return this.then(async function (array) {
      const promises = array.map(callback, context)
      const results = await Promise.all(promises)
      for (let i = 0, length = results.length; i < length; ++i) {
        if (results[i]) {
          return i
        }
      }
      return -1
    })
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, iterating over them concurrently. When all
  // are processed, it will return an extended promise resolving to the
  // original array.
  forEachConcurrently (callback, context) {
    const promise = this.then(async function (array) {
      const promises = array.map(callback, context)
      await Promise.all(promises)
      return array
    })
    return PromisedArray.fromPromise(promise)
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, iterating over them concurrently. When all
  // are processed, it will return an extended promise resolving to an array
  // of the resolved callback results.
  mapConcurrently (callback, context) {
    const promise = this.then(function (array) {
      const promises = array.map(callback, context)
      return Promise.all(promises)
    })
    return PromisedArray.fromPromise(promise)
  },

  // Iterates over every item in the array. If the item is a promise, it
  // will wait for its resolution, concurrently with the others. Eventually
  // it will return a promise resolving to an array of all resolved items.
  resolveConcurrently () {
    const promise = this.then(function (array) {
      return Promise.all(array)
    })
    return PromisedArray.fromPromise(promise)
  },

  // Waits for synchronous results or promises returned by the callback for
  // every item in the array, iterating over them concurrently. When all
  // are processed, if just one result is truthy, this method will return
  // a promise resolving to `true`. Otherwise it will return a promise
  // resolving to `false`.
  someConcurrently (callback, context) {
    return this.then(async function (array) {
      const promises = array.map(callback, context)
      const results = await Promise.all(promises)
      for (let i = 0, length = results.length; i < length; ++i) {
        if (results[i]) {
          return true
        }
      }
      return false
    })
  }
}

// Methods, which return an array, but do not accept callbacks as
// parameters, do not need asychronous handling of the callbacks.
// Because they return an array, their result is wrapped in an extended
// promise and as such it can continue chaining of all `PromisedArray`
// method calls. The returned promise resolves to the array returned
// by the original method from the `Array` prototype; it is not always
// the input array.
const chainableMethods = [
  'concat', 'copyWithin', 'fill', 'reverse', 'slice', 'sort', 'splice'
]

// Extend the prototyoe of `PromisedArray` with methods, that return
// an array and do not accept callbacks as parameters.
chainableMethods.forEach(function (name) {
  const method = arrayPrototype[name]
  /* istanbul ignore next */
  if (method) {
    promisedArrayPrototype[name] = function () {
      const parameters = arguments
      const promise = this.then(function (array) {
        return method.apply(array, parameters)
      })
      return PromisedArray.fromPromise(promise)
    }
  }
})

// Methods, which do not return an array and do not accept callbacks as
// parameters, do not need asychronous handling of their parameters.
// Because they do not return an array, their result cannot be wrapped
// in an extended promise. They return the standard promise and as such
// they cannot continue chaining of `PromisedArray` method calls; only
// the standard promise method calls. The returned promise resolves to
// the result of the original method from the `Array` prototype.
const terminalMethods = [
  'entries', 'includes', 'indexOf', 'lastIndexOf', 'join', 'keys',
  'pop', 'push', 'shift', 'unshift', 'values'
]

// Extend the prototyoe of `PromisedArray` with methods, that do not
// return an array and do not accept callbacks as parameters.
terminalMethods.forEach(function (name) {
  const method = arrayPrototype[name]
  /* istanbul ignore next */
  if (method) {
    promisedArrayPrototype[name] = function () {
      const parameters = arguments
      return this.then(function (array) {
        return method.apply(array, parameters)
      })
    }
  }
})

// Definition of the asynchronous property `length`.
const promisedLength = {
  // Returns a promise resolving to the array length.
  get: function () {
    return this.then(async function (array) {
      return array.length
    })
  },

  // Sets the array length to the specified value and returns a promise
  // resolving to the new array length.
  set: function (value) {
    return this.then(async function (array) {
      array.length = value
      return value
    })
  }
}

// Factory for creating instances of `PromisedArray`
class PromisedArray {
  // Returns a promise resolving to the specified array and including
  // additional asynchronous methods and properties working an the array.
  static fromArray (array) {
    const promise = Promise.resolve(array)
    return PromisedArray.fromPromise(promise)
  }

  // Extends the promise, which is supposed to resolve to an array, with
  // additional asynchronous methods and properties working an the array.
  static fromPromise (promise) {
    Object.assign(promise, promisedArrayPrototype)
    Object.defineProperty(promise, 'length', promisedLength)
    return promise
  }

  // Checks if the specified object is an extended promise.
  static isPromisedArray (array) {
    return array instanceof Promise && typeof array.map === 'function'
  }
}

export { PromisedArray }
