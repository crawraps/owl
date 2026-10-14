import { fileURLToPath } from 'node:url'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rstest/core'

export default defineConfig({
  plugins: [
    pluginBabel({
      babelLoaderOptions: {
        plugins: [fileURLToPath(new URL('../../scripts/babel/auto-clsx.js', import.meta.url))],
      },
    }),
    pluginReact(),
  ],
  testEnvironment: 'happy-dom',
  include: ['src/**/testing/**/*.test.{ts,tsx}'],
})
