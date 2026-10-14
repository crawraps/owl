import { fileURLToPath } from 'node:url'
import { defineConfig } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginEnv } from '@repo/env'
import { envSchema } from './env'

export default defineConfig({
  source: { entry: { index: './src/main.tsx' } },
  html: { meta: { viewport: 'width=device-width, initial-scale=1, viewport-fit=cover' } },
  plugins: [
    pluginEnv(envSchema),
    pluginBabel({
      babelLoaderOptions: {
        plugins: [fileURLToPath(new URL('../../scripts/babel/auto-clsx.js', import.meta.url)), ['babel-plugin-react-compiler', {}]],
      },
    }),
    pluginReact({
      swcReactOptions: {
        refresh: true,
        runtime: 'automatic',
      },
    }),
  ],
  dev: { writeToDisk: true, lazyCompilation: false },
  server: { host: '127.0.0.1', port: 3000, strictPort: true },
  output: { distPath: { root: 'dist' } },
})
