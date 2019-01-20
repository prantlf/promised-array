import { PromisedArray } from '..'

declare function describe (label: string, callback: Function)
declare function it (label: string, callback: Function)

describe('Type declarations for PromisedArray\'s static member', () => {
  it('fromArray', () => {
    PromisedArray.fromArray([])
  })
  it('fromPromise', () => {
    PromisedArray.fromPromise(Promise.resolve([]))
  })
  it('isPromisedArray', () => {
    PromisedArray.isPromisedArray(null)
  })
})
