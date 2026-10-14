import { resolve } from 'node:path'
import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
  lib: [
    {
      id: 'library',
      format: 'esm',
      bundle: false,
      dts: true,
      source: {
        entry: {
          index: ['./src/**'],
        },
      },
      output: {
        distPath: {
          root: './dist',
        },
        target: 'web',
      },
    },
  ],
  plugins: [pluginReact()],
})
