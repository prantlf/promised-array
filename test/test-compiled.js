/* global describe, it */

const { PromisedArray } = require('..')
const { expect } = require('chai')

describe('Compiled PromisedArray', () => {
  it('exports expected static class', () => {
    expect(PromisedArray).to.be.an('function')
    expect(PromisedArray.fromArray).to.be.a('function')
  })
})
