require('dotenv').config()

import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [
    replace({
      values: {
        'process.env.LICHESS_API_TOKEN': JSON.stringify(process.env.LICHESS_API_TOKEN),
        'process.env.LICHESS_USERNAME': JSON.stringify(process.env.LICHESS_USERNAME)
      },
      preventAssignment: true
    }),
    commonjs(),
    nodeResolve()
  ]
}