/* eslint-disable no-unused-expressions */
/* global before, beforeEach, describe, it */

import { PromisedArray } from '../src/index.mjs'
import chai from 'chai'
const { expect } = chai

describe('PromisedArray\'s testing method', () => {
  describe('delayValue', () => {
    let promise

    before(() => {
      promise = delayValue(1)
    })

    it('returns a promise', () => {
      expect(promise).to.be.instanceOf(Promise)
    })

    it('the promise resolves to the input value', async () => {
      expect(await promise).to.equal(1)
    })
  })

  describe('makeAsynchronous', () => {
    let callback

    before(() => {
      callback = makeAsynchronous(item => item > 0)
    })

    it('returns a function', () => {
      expect(callback).to.be.a('function')
    })

    it('the function returns a promise', () => {
      expect(callback()).to.be.instanceOf(Promise)
    })

    it('the promise resolves to the original callback result', async () => {
      // eslint-disable-next-line standard/no-callback-literal
      expect(await callback(1)).to.equal(true)
    })

    it('the callback will obtain original parameters', async () => {
      const callback = makeAsynchronous((first, second) => first + second)
      // eslint-disable-next-line standard/no-callback-literal
      expect(await callback(1, 2)).to.equal(3)
    })
  })
})

describe('PromisedArray\'s class method', () => {
  describe('fromArray', () => {
    let promisedArray

    before(() => {
      promisedArray = PromisedArray.fromArray([ 1, 2 ])
    })

    it('returns a promised array', () => {
      expect(promisedArray).to.be.instanceOf(Promise)
      expect(promisedArray.map).to.be.a('function')
    })

    it('the promise resolves to the input array', async () => {
      const array = await promisedArray
      expect(array).to.deep.equal([ 1, 2 ])
    })
  })

  describe('fromPromise', () => {
    let promisedArray

    before(() => {
      promisedArray = PromisedArray.fromPromise(Promise.resolve([ 1, 2 ]))
    })

    it('returns a promised array', () => {
      expect(promisedArray).to.be.instanceOf(Promise)
      expect(promisedArray.map).to.be.a('function')
    })

    it('the promise resolves to the original promise\'s input', async () => {
      const array = await promisedArray
      expect(array).to.deep.equal([ 1, 2 ])
    })
  })

  describe('isPromisedArray', () => {
    it('recognizes a PromisedArray', () => {
      const promisedArray = PromisedArray.fromArray([])
      const result = PromisedArray.isPromisedArray(promisedArray)
      expect(result).to.be.true
    })

    it('does not recognize a Promise', () => {
      const result = PromisedArray.isPromisedArray(Promise.resolve())
      expect(result).to.be.false
    })

    it('does not recognize an array', () => {
      const result = PromisedArray.isPromisedArray([])
      expect(result).to.be.false
    })
  })
})

describe('PromisedArray\'s instance method expecting a callback', () => {
  let array
  let promisedArray

  before(() => {
    array = [ 1, 2 ]
    promisedArray = PromisedArray.fromArray(array)
  })

  describe('every', () => {
    it('returns a promise', () => {
      const promise = promisedArray.every(() => {})
      expect(promise).to.be.instanceOf(Promise)
    })

    it('resolves to true for an empty array', async () => {
      const promisedArray = PromisedArray.fromArray([])
      const result = await promisedArray.every(() => false)
      expect(result).to.be.true
    })

    describe('with a synchronous callback', () => {
      it('resolves to true if all items match the condition', async () => {
        const result = await promisedArray.every(item => item > 0)
        expect(result).to.be.true
      })

      it('resolves to false if no item matches the condition', async () => {
        const result = await promisedArray.every(item => item < 2)
        expect(result).to.be.false
      })
    })

    describe('with an asynchronous callback', () => {
      it('resolves to true if all items match the condition', async () => {
        const callback = makeAsynchronous(item => item > 0)
        const result = await promisedArray.every(callback)
        expect(result).to.be.true
      })

      it('resolves to false if no item matches the condition', async () => {
        const callback = makeAsynchronous(item => item < 2)
        const result = await promisedArray.every(callback)
        expect(result).to.be.false
      })
    })
  })

  describe('filter', () => {
    it('returns a promised array', () => {
      const promise = promisedArray.filter(() => {})
      expect(promise).to.be.instanceOf(Promise)
      expect(promisedArray.map).to.be.a('function')
    })

    describe('with a synchronous callback', () => {
      it('resolves to an array with items matching the condition', async () => {
        const result = await promisedArray.filter(item => item > 1)
        expect(result).to.deep.equal([ 2 ])
      })
    })

    describe('with an asynchronous callback', () => {
      it('resolves to an array with items matching the condition', async () => {
        const callback = makeAsynchronous(item => item > 1)
        const result = await promisedArray.filter(callback)
        expect(result).to.deep.equal([ 2 ])
      })
    })
  })

  describe('find', () => {
    it('returns a promise', () => {
      const promise = promisedArray.find(() => {})
      expect(promise).to.be.instanceOf(Promise)
    })

    describe('with a synchronous callback', () => {
      it('resolves to undefined if no item matches the condition', async () => {
        const result = await promisedArray.find(item => item < 0)
        expect(result).to.be.undefined
      })

      it('resolves to the first item matching the condition', async () => {
        const result = await promisedArray.find(item => item > 0)
        expect(result).to.equal(1)
      })
    })

    describe('with an asynchronous callback', () => {
      it('resolves to undefined if no item matches the condition', async () => {
        const callback = makeAsynchronous(item => item < 0)
        const result = await promisedArray.find(callback)
        expect(result).to.be.undefined
      })

      it('resolves to the first item matching the condition', async () => {
        const callback = makeAsynchronous(item => item > 0)
        const result = await promisedArray.find(callback)
        expect(result).to.equal(1)
      })
    })
  })

  describe('findIndex', () => {
    it('returns a promise', () => {
      const promise = promisedArray.findIndex(() => {})
      expect(promise).to.be.instanceOf(Promise)
    })

    describe('with a synchronous callback', () => {
      it('resolves to -1 if no item matches the condition', async () => {
        const index = await promisedArray.findIndex(item => item < 0)
        expect(index).to.equal(-1)
      })

      it('resolves to the index of the first matching item', async () => {
        const index = await promisedArray.findIndex(item => item > 0)
        expect(index).to.equal(0)
      })
    })

    describe('with an asynchronous callback', () => {
      it('resolves to -1 if no item matches the condition', async () => {
        const callback = makeAsynchronous(item => item < 0)
        const index = await promisedArray.findIndex(callback)
        expect(index).to.equal(-1)
      })

      it('resolves to the index of the first matching item', async () => {
        const callback = makeAsynchronous(item => item > 0)
        const result = await promisedArray.findIndex(callback)
        expect(result).to.equal(0)
      })
    })
  })

  describe('forEach', () => {
    it('returns a promised array', () => {
      const promise = promisedArray.forEach(() => {})
      expect(promise).to.be.instanceOf(Promise)
      expect(promisedArray.map).to.be.a('function')
    })

    it('the promise resolves to the original array', async () => {
      const result = await promisedArray.forEach(() => {})
      expect(result).to.equal(array)
    })

    describe('with a synchronous callback', () => {
      it('calls it for each item in order', async () => {
        const order = []
        await promisedArray.forEach(item => order.push(item))
        expect(order).to.deep.equal(array)
      })
    })

    describe('with an asynchronous callback', () => {
      it('calls it for each item in order', async () => {
        const order = []
        const callback = makeAsynchronous(item => order.push(item))
        await promisedArray.forEach(callback)
        expect(order).to.deep.equal(array)
      })
    })
  })

  describe('map', () => {
    it('returns a promised array', () => {
      const promise = promisedArray.map(() => {})
      expect(promise).to.be.instanceOf(Promise)
      expect(promisedArray.map).to.be.a('function')
    })

    it('resolves to an empty array for an empty array', async () => {
      const promisedArray = PromisedArray.fromArray([])
      const result = await promisedArray.map(() => {})
      expect(result).to.be.an('array').that.is.empty
    })

    describe('with a synchronous callback', () => {
      it('resolves to an array of items returned by the callback', async () => {
        const result = await promisedArray.map(item => item + 1)
        expect(result).to.deep.equal([ 2, 3 ])
      })
    })

    describe('with an asynchronous callback', () => {
      it('resolves to an array of items returned by the callback', async () => {
        const callback = makeAsynchronous(item => item + 1)
        const result = await promisedArray.map(callback)
        expect(result).to.deep.equal([ 2, 3 ])
      })
    })
  })

  describe('reduce', () => {
    it('returns a promise', () => {
      const promise = promisedArray.reduce(() => {})
      expect(promise).to.be.instanceOf(Promise)
    })

    it('resolves to the original result for an empty array', async () => {
      const promisedArray = PromisedArray.fromArray([])
      const result = await promisedArray.reduce(() => {}, 1)
      expect(result).to.equal(1)
    })

    describe('with a synchronous callback', () => {
      it('resolves to the result returned by the last callback', async () => {
        const callback = (result, item) => result.concat(item)
        const result = await promisedArray.reduce(callback, [])
        expect(result).to.deep.equal(array)
      })
    })

    describe('with an asynchronous callback', () => {
      it('resolves to the result returned by the last callback', async () => {
        const callback = makeAsynchronous((result, item) => result.concat(item))
        const result = await promisedArray.reduce(callback, [])
        expect(result).to.deep.equal(array)
      })
    })
  })

  describe('reduceRight', () => {
    it('returns a promise', () => {
      const promise = promisedArray.reduceRight(() => {})
      expect(promise).to.be.instanceOf(Promise)
    })

    it('resolves to the original result for an empty array', async () => {
      const promisedArray = PromisedArray.fromArray([])
      const result = await promisedArray.reduceRight(() => {}, 1)
      expect(result).to.equal(1)
    })

    describe('with a synchronous callback', () => {
      it('resolves to the result returned by the last callback', async () => {
        const callback = (result, item) => result.concat(item)
        const result = await promisedArray.reduceRight(callback, [])
        expect(result).to.deep.equal([ 2, 1 ])
      })
    })

    describe('with an asynchronous callback', () => {
      it('resolves to the result returned by the last callback', async () => {
        const callback = makeAsynchronous((result, item) => result.concat(item))
        const result = await promisedArray.reduceRight(callback, [])
        expect(result).to.deep.equal([ 2, 1 ])
      })
    })
  })

  describe('resolve', () => {
    it('returns a promise', () => {
      const promise = promisedArray.resolve()
      expect(promise).to.be.instanceOf(Promise)
    })

    it('resolves to an empty array for an empty array', async () => {
      const promisedArray = PromisedArray.fromArray([])
      const array = await promisedArray.resolve()
      expect(array).to.be.an('array').that.is.empty
    })

    it('passes through values', async () => {
      const array = await promisedArray.resolve()
      expect(array).to.deep.equal([ 1, 2 ])
    })

    it('waits for promises', async () => {
      const array = await PromisedArray
        .fromArray([ delayValue(1), delayValue(2) ])
        .resolve()
      expect(array).to.deep.equal([ 1, 2 ])
    })

    it('works with a mixture of values and promises', async () => {
      const array = await PromisedArray
        .fromArray([ 1, delayValue(2) ])
        .resolve()
      expect(array).to.deep.equal([ 1, 2 ])
    })

    it('does not modify the original array', async () => {
      const array = [ delayValue(1) ]
      const result = await PromisedArray
        .fromArray(array)
        .resolve()
      expect(array[0]).to.be.instanceOf(Promise)
      expect(result).to.deep.equal([ 1 ])
    })
  })

  describe('some', () => {
    it('returns a promise', () => {
      const promise = promisedArray.some(() => {})
      expect(promise).to.be.instanceOf(Promise)
    })

    it('resolves to false for an empty array', async () => {
      const promisedArray = PromisedArray.fromArray([])
      const result = await promisedArray.some(() => false)
      expect(result).to.be.false
    })

    describe('with a synchronous callback', () => {
      it('resolves to true if at least one item matches the condition', async () => {
        const result = await promisedArray.some(item => item > 1)
        expect(result).to.be.true
      })

      it('resolves to false if no item matches the condition', async () => {
        const result = await promisedArray.some(item => item < 0)
        expect(result).to.be.false
      })
    })

    describe('with an asynchronous callback', () => {
      it('resolves to true if at least one item matches the condition', async () => {
        const callback = makeAsynchronous(item => item > 1)
        const result = await promisedArray.some(callback)
        expect(result).to.be.true
      })

      it('resolves to false if no item matches the condition', async () => {
        const callback = makeAsynchronous(item => item < 0)
        const result = await promisedArray.some(callback)
        expect(result).to.be.false
      })
    })
  })
})

describe('PromisedArray\'s chainable immutable instance method expecting no callback', () => {
  const methods = [
    'concat', 'reverse', 'slice'
  ]

  let array
  let promisedArray

  before(() => {
    array = [ 1, 2 ]
    promisedArray = PromisedArray.fromArray(array)
  })

  for (const method of methods) {
    if (Array.prototype[method]) {
      describe(method, () => {
        it('returns a promised array', () => {
          const promise = promisedArray[method](() => {})
          expect(promise).to.be.instanceOf(Promise)
          expect(promise.map).to.be.a('function')
        })

        it('returns the same as the original method', async () => {
          const promise = promisedArray[method](3)
          expect(await promise).to.deep.equal(array[method](3))
        })
      })
    }
  }
})

describe('PromisedArray\'s chainable mutable instance method expecting no callback', () => {
  const methods = [
    'copyWithin', 'fill', 'splice'
  ]

  let array
  let promisedArray

  beforeEach(() => {
    array = [ 1, 2 ]
    promisedArray = PromisedArray.fromArray([ 1, 2 ])
  })

  for (const method of methods) {
    if (Array.prototype[method]) {
      describe(method, () => {
        it('returns a promised array', () => {
          const promise = promisedArray[method](() => {})
          expect(promise).to.be.instanceOf(Promise)
          expect(promise.map).to.be.a('function')
        })

        it('returns the same as the original method', async () => {
          const promise = promisedArray[method](0, 1, 2)
          expect(await promise).to.deep.equal(array[method](0, 1, 2))
        })
      })
    }
  }
})

describe('PromisedArray\'s chainable mutable instance method expecting synchronous callback', () => {
  let array
  let promisedArray

  beforeEach(() => {
    array = [ 1, 2 ]
    promisedArray = PromisedArray.fromArray([ 1, 2 ])
  })

  describe('sort', () => {
    it('returns a promised array', () => {
      const promise = promisedArray.sort()
      expect(promise).to.be.instanceOf(Promise)
      expect(promise.map).to.be.a('function')
    })

    it('returns the same as the original method', async () => {
      const promise = promisedArray.sort()
      expect(await promise).to.deep.equal(array.sort())
    })
  })
})

describe('PromisedArray\'s lookup instance method', () => {
  const methods = [
    'includes', 'indexOf', 'lastIndexOf'
  ]

  let array
  let promisedArray

  before(() => {
    array = [ 1, 2 ]
    promisedArray = PromisedArray.fromArray(array)
  })

  for (const method of methods) {
    if (Array.prototype[method]) {
      describe(method, () => {
        it('returns a promise', () => {
          const promise = promisedArray[method](() => {})
          expect(promise).to.be.instanceOf(Promise)
        })

        it('returns the same as the original method for a matching item', async () => {
          const promise = promisedArray[method](1)
          expect(await promise).to.deep.equal(array[method](1))
        })

        it('returns the same  as the original method for a non-matching item', async () => {
          const promise = promisedArray[method](0)
          expect(await promise).to.deep.equal(array[method](0))
        })
      })
    }
  }
})

describe('PromisedArray\'s terminal immutable instance method expecting no callback', () => {
  const methods = [
    'entries', 'join', 'keys', 'values'
  ]

  let array
  let promisedArray

  before(() => {
    array = [ 1, 2 ]
    promisedArray = PromisedArray.fromArray(array)
  })

  for (const method of methods) {
    if (Array.prototype[method]) {
      describe(method, () => {
        it('returns a promise', () => {
          const promise = promisedArray[method](() => {})
          expect(promise).to.be.instanceOf(Promise)
        })

        it('returns the same as the original method', async () => {
          const promise = promisedArray[method](3)
          expect(await promise).to.deep.equal(array[method](3))
        })
      })
    }
  }
})

describe('PromisedArray\'s mutable terminal instance method expecting no callback', () => {
  const methods = [
    'pop', 'push', 'shift', 'unshift'
  ]

  let array
  let promisedArray

  beforeEach(() => {
    array = [ 1, 2 ]
    promisedArray = PromisedArray.fromArray([ 1, 2 ])
  })

  for (const method of methods) {
    if (Array.prototype[method]) {
      describe(method, () => {
        it('returns a promise', () => {
          const promise = promisedArray[method](() => {})
          expect(promise).to.be.instanceOf(Promise)
        })

        it('returns the same as the original method', async () => {
          const promise = promisedArray[method](3)
          expect(await promise).to.deep.equal(array[method](3))
        })
      })
    }
  }
})

describe('PromisedArray\'s instance property', () => {
  describe('length', () => {
    let array
    let promisedArray

    before(() => {
      array = [ 1, 2 ]
      promisedArray = PromisedArray.fromArray(array)
    })

    describe('has a getter', () => {
      it('that returns a promise', () => {
        expect(promisedArray.length).to.be.instanceOf(Promise)
      })

      it('that resolves to the array length', async () => {
        expect(await promisedArray.length).to.equal(2)
      })
    })

    describe('has a setter', () => {
      let length

      before(async () => {
        length = await (promisedArray.length = 3)
      })

      it('that resolves to the new array length', () => {
        expect(length).to.equal(3)
      })

      it('that modified the original array length', () => {
        expect(array).to.have.length(3)
      })
    })
  })
})

function delayValue (value) {
  return new Promise(resolve => setTimeout(() => resolve(value)))
}

function makeAsynchronous (callback) {
  return (...parameters) => {
    return new Promise(resolve =>
      // eslint-disable-next-line standard/no-callback-literal
      setTimeout(() => resolve(callback(...parameters))))
  }
}
