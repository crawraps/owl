import { resolve } from 'node:path'
import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [{ format: 'esm', syntax: 'esnext', dts: true }],
  resolve: { alias: { src: resolve(__dirname, './src') } },
  source: {
    entry: { index: './src/index.ts' },
    tsconfigPath: './tsconfig.build.json',
  },
  output: { target: 'node', distPath: { root: './dist' } },
})
