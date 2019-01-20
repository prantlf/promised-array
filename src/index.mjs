const arrayPrototype = Array.prototype

// Methods, which accept callbacks, need asychronous support. Those,
// which return an array, have the array wrapped in PromisedArray and
// thus support chaining. The output array is the result of the function
// call; not generally the input array, which the method was called with.
const promisedArrayPrototype = {
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

  filter (callback, context) {
    const promise = this.then(async function (array) {
      const result = []
      for (let i = 0, length = array.length; i < length; ++i) {
        const item = array[i]
        if (await callback.call(context, item, i, array)) {
          result.push(item)
        }
      }
      return result
    })
    return PromisedArray.fromPromise(promise)
  },

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

  forEach (callback, context) {
    const promise = this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        await callback.call(context, array[i], i, array)
      }
      return array
    })
    return PromisedArray.fromPromise(promise)
  },

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

  reduce (callback, result, context) {
    return this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        result = await callback.call(context, result, array[i], i, array)
      }
      return result
    })
  },

  reduceRight (callback, result, context) {
    return this.then(async function (array) {
      for (let i = array.length; --i >= 0;) {
        result = await callback.call(context, result, array[i], i, array)
      }
      return result
    })
  },

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

  some (callback, context) {
    return this.then(async function (array) {
      for (let i = 0, length = array.length; i < length; ++i) {
        if (await callback.call(context, array[i], i, array)) {
          return true
        }
      }
      return false
    })
  }
}

// Methods, which return an array, but do not accept callbacks, do
// not need asychronous support for their parameters. Their result
// is wrapped in PromisedArray and thus supports chaining. The
// output array is the result of the function call; not generally
// the input array, which the method was called with.
const chainableMethods = [
  'concat', 'copyWithin', 'fill', 'reverse', 'slice', 'sort', 'splice'
]

chainableMethods.forEach(function (name) {
  const method = arrayPrototype[name]
  promisedArrayPrototype[name] = function () {
    const parameters = arguments
    const promise = this.then(function (array) {
      return method.apply(array, parameters)
    })
    return PromisedArray.fromPromise(promise)
  }
})

// Methods, which do not return an array and do not accept callbacks,
// do not need asychronous support for their parameters and have to
// be at the end of the chain of PromisedArray method calls.
const terminalMethods = [
  'entries', 'includes', 'indexOf', 'lastIndexOf', 'join', 'keys', 'pop', 'push', 'shift', 'unshift', 'values'
]

terminalMethods.forEach(function (name) {
  const method = arrayPrototype[name]
  promisedArrayPrototype[name] = function () {
    const parameters = arguments
    return this.then(function (array) {
      return method.apply(array, parameters)
    })
  }
})

// Definition of the asynchronous property "length".
const promisedLength = {
  get: function () {
    return this.then(async function (array) {
      return array.length
    })
  },

  set: function (value) {
    return this.then(async function (array) {
      array.length = value
      return value
    })
  }
}

class PromisedArray {
  static fromArray (array) {
    const promise = Promise.resolve(array)
    return PromisedArray.fromPromise(promise)
  }

  static fromPromise (promise) {
    Object.assign(promise, promisedArrayPrototype)
    Object.defineProperty(promise, 'length', promisedLength)
    return promise
  }

  static isPromisedArray (array) {
    return array instanceof Promise && typeof array.map === 'function'
  }
}

export { PromisedArray }
