// Interface of `PromisedArray` instances
declare class PromisedArrayInstance implements Promise<any> {
  // Methods from the `Promise` prototype
  then (fulfilled?: (value: any) => any, rejected?: (error: any) => any): Promise<any>
  catch (rejected?: (error: any) => any): Promise<any>
  finally (finished?: (() => void) | undefined | null): Promise<any>

  // Methods from the `Object` prototype
  readonly [Symbol.toStringTag]: string

  // Properties from the `Array` prototype
  length: Promise<number>

  // Methods from the `Array` prototype
  copyWithin (target: any, start: number, end?: number): PromisedArrayInstance
  every (callback: (value: any, index: number, array: any[]) => boolean, context?: any): Promise<boolean>
  fill (value: any, start?: number, end?: number): PromisedArrayInstance
  filter (callback: (value: any, index: number, array: any[]) => any, context?: any): PromisedArrayInstance
  find (predicate: (value: any, index: number, obj: any[]) => boolean, context?: any): Promise<any>
  findIndex (predicate: (value: any, index: number, obj: any[]) => boolean, context?: any): Promise<number>
  forEach (callback: (value: any, index: number, array: any[]) => void, context?: any): PromisedArrayInstance
  includes (value: any, start: number): Promise<boolean>
  indexOf (value: any, start?: number): Promise<number>
  join (separator?: string): Promise<string>
  lastIndexOf (value: any, start?: number): Promise<number>
  map (callback: (value: any, index: number, array: any[]) => any, context?: any): PromisedArrayInstance
  reduce (callback: (result: any, value: any, index: number, array: any[]) => any, input: any): Promise<any>
  reduceRight (callback: (result: any, value: number, index: number, array: any[]) => number, input: any): Promise<any>
  reverse (): PromisedArrayInstance
  slice (start?: number, end?: number): PromisedArrayInstance
  some (callback: (value: any, index: number, array: any[]) => boolean, context?: any): Promise<boolean>
  sort (compare?: (left: any, right: any) => number): PromisedArrayInstance

  // Methods from the `Array` prototype executing their callbacks concurrently
  everyConcurrently (callback: (value: any, index: number, array: any[]) => boolean, context?: any): Promise<boolean>
  filterConcurrently (callback: (value: any, index: number, array: any[]) => any, context?: any): PromisedArrayInstance
  findConcurrently (predicate: (value: any, index: number, obj: any[]) => boolean, context?: any): Promise<any>
  findIndexConcurrently (predicate: (value: any, index: number, obj: any[]) => boolean, context?: any): Promise<number>
  forEachConcurrently (callback: (value: any, index: number, array: any[]) => void, context?: any): PromisedArrayInstance
  mapConcurrently (callback: (value: any, index: number, array: any[]) => any, context?: any): PromisedArrayInstance
  someConcurrently (callback: (value: any, index: number, array: any[]) => boolean, context?: any): Promise<boolean>

  // Methods from the `PromisedArray` prototype
  resolve (): PromisedArrayInstance
}

// Factory for creating instances of `PromisedArray`
declare class PromisedArray {
  // Disable creating instances of `PromisedArray` by the constructor
  private constructor ()

  // Static methods of `PromisedArray`
  static fromArray (array: any[]): PromisedArrayInstance
  static fromPromise (promise: Promise<any[]>): PromisedArrayInstance
  static isPromisedArray (array: any): boolean
}

export { PromisedArray }
