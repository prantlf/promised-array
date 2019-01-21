import babel from 'rollup-plugin-babel'
import clean from 'rollup-plugin-clean'
import { uglify } from 'rollup-plugin-uglify'

export default [
  {
    input: 'src/index.mjs',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      clean()
    ]
  },
  {
    input: 'src/index.mjs',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      amd: {
        id: 'promised-array'
      },
      name: 'promisedArray',
      sourcemap: true
    },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      uglify()
    ]
  }
]
