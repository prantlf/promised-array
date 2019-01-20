declare class PromisedArrayInstance implements Promise<any> {
  then (fulfilled?: (value: any) => any, rejected?: (error: any) => any): Promise<any>
  catch (rejected?: (error: any) => any): Promise<any>
  readonly [Symbol.toStringTag]: string

  length: Promise<number>

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

  resolve (): PromisedArrayInstance
}

declare class PromisedArray {
  private constructor ()

  static fromArray (array: any[]): PromisedArrayInstance
  static fromPromise (promise: Promise<any[]>): PromisedArrayInstance
  static isPromisedArray (array: any): boolean
}

export { PromisedArray }

// export as namespace promisedArray
