import { join } from 'node:path'
import type { RsbuildPlugin } from '@rsbuild/core'
import { EnvError } from 'src/error'
import { loadEnvFiles } from 'src/files'
import { type EnvSchema, validateEnv } from 'src/schema'
import { resolveAppEnv } from './app-env'

export interface PluginEnvOptions {
  /** Variables available to `${VAR}` and `APP_ENV`. Defaults to `process.env`. */
  os?: Record<string, string | undefined>
}

const cleared = /^(import\.meta\.env|process\.env)(\.|$)/

export function pluginEnv(schema: EnvSchema, { os = process.env }: PluginEnvOptions = {}): RsbuildPlugin {
  if (typeof schema?.shape !== 'object') {
    // Rsbuild loads its config with jiti's interopDefault, which turns a default-exported schema into zod's `.default` method.
    throw new TypeError('pluginEnv expects a zod object schema. Import it from a named export, not `export default`.')
  }
  return {
    name: 'repo:env',
    setup(api) {
      api.modifyRsbuildConfig(async config => {
        const appEnv = resolveAppEnv(os.APP_ENV, api.context.action)
        if (typeof appEnv !== 'string') throw new EnvError([appEnv])

        const dir = join(api.context.rootPath, '.env')
        const files = await loadEnvFiles({ dir, appEnv, os })
        const { define, issues } = validateEnv(schema, files.values)
        if (files.issues.length > 0 || issues.length > 0) throw new EnvError([...files.issues, ...issues])

        const kept = Object.entries(config.source?.define ?? {}).filter(([key]) => !cleared.test(key))
        config.source = {
          ...config.source,
          define: {
            ...Object.fromEntries(kept),
            // Replacing the whole object also removes Rsbuild's MODE, DEV, PROD, BASE_URL and ASSET_PREFIX.
            'import.meta.env': { ...define, APP_ENV: JSON.stringify(appEnv) },
            'process.env.BASE_URL': 'undefined',
            'process.env.ASSET_PREFIX': 'undefined',
          },
        }
        const watchFiles = config.dev?.watchFiles ?? []
        config.dev = {
          ...config.dev,
          watchFiles: [...(Array.isArray(watchFiles) ? watchFiles : [watchFiles]), { paths: dir, type: 'reload-server' }],
        }
      })
    },
  }
}
