import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRsbuild, type RsbuildConfig } from '@rsbuild/core'
import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { defineEnv } from 'src/schema'
import { pluginEnv } from '../model/plugin'

const directories: string[] = []
const schema = defineEnv(z.object({ API_URL: z.url(), DEBUG: z.stringbool().default(false) }))

async function app(files: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), 'repo-env-plugin-'))
  directories.push(root)
  await mkdir(join(root, '.env'))
  await mkdir(join(root, 'src'))
  await writeFile(join(root, 'src/index.js'), 'console.log(import.meta.env.API_URL, import.meta.env.APP_ENV, import.meta.env.MODE)\n')
  await Promise.all(Object.entries(files).map(([name, text]) => writeFile(join(root, '.env', name), text)))
  return root
}

async function resolve(root: string, action: 'dev' | 'build', os: Record<string, string> = {}, config: RsbuildConfig = {}) {
  const rsbuild = await createRsbuild({ cwd: root, rsbuildConfig: { logLevel: 'silent', ...config, plugins: [pluginEnv(schema, { os })] } })
  if (action === 'dev') await (await rsbuild.createDevServer()).close()
  else await rsbuild.build()
  return rsbuild.getNormalizedConfig()
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

describe('pluginEnv', () => {
  it('defines validated values and APP_ENV on import.meta.env, defaulting to dev for the dev server', async () => {
    const root = await app({ base: 'API_URL=https://base.example', dev: 'DEBUG=true' })
    const { source } = await resolve(root, 'dev')
    expect(source.define['import.meta.env']).toEqual({ API_URL: '"https://base.example"', DEBUG: 'true', APP_ENV: '"dev"' })
  })

  it('defaults to prod for builds and honours APP_ENV', async () => {
    const root = await app({ base: 'API_URL=https://${HOST}', test: 'DEBUG=true' })
    expect((await resolve(root, 'build', { HOST: 'a.example' })).source.define['import.meta.env']).toMatchObject({ APP_ENV: '"prod"', DEBUG: 'false' })
    expect((await resolve(root, 'build', { HOST: 'a.example', APP_ENV: 'test' })).source.define['import.meta.env']).toMatchObject({
      API_URL: '"https://a.example"',
      APP_ENV: '"test"',
      DEBUG: 'true',
    })
  })

  it('inlines values into the bundle', async () => {
    const root = await app({ base: 'API_URL=https://inlined.example' })
    await resolve(root, 'build', { APP_ENV: 'test' }, { output: { minify: false } })
    const bundle = await readFile(join(root, 'dist/static/js/index.js'), 'utf8')
    expect(bundle).toContain('console.log("https://inlined.example", "test", ')
    expect(bundle).not.toContain('production')
  })

  it('drops other import.meta.env and process.env definitions', async () => {
    const root = await app({ base: 'API_URL=https://a.example' })
    const { source } = await resolve(root, 'build', {}, { source: { define: { 'import.meta.env.PUBLIC_X': '"x"', 'process.env.PUBLIC_X': '"x"', __KEEP__: '1' } } })
    expect(source.define).toEqual({
      'import.meta.env': { API_URL: '"https://a.example"', DEBUG: 'false', APP_ENV: '"prod"' },
      'process.env.BASE_URL': 'undefined',
      'process.env.ASSET_PREFIX': 'undefined',
      __KEEP__: '1',
    })
  })

  it('restarts the dev server when .env files change', async () => {
    const root = await app({ base: 'API_URL=https://a.example' })
    const { dev } = await resolve(root, 'dev')
    expect(dev.watchFiles).toContainEqual({ paths: join(root, '.env'), type: 'reload-server' })
  })

  it('throws every issue at once', async () => {
    const root = await app({ base: 'oops\nAPI_URL=${MISSING}', dev: 'TYPO=1' })
    await expect(resolve(root, 'dev')).rejects.toThrow(/\.env\/base:1.*\n.*\.env\/base:2.*MISSING.*\n.*\.env\/dev:1.*TYPO/)
  })

  it('explains a schema that is not a zod object', () => {
    expect(() => pluginEnv(schema.default as never)).toThrow(/named export/)
  })

  it('rejects unknown APP_ENV values', async () => {
    const root = await app({ base: 'API_URL=https://a.example' })
    await expect(resolve(root, 'build', { APP_ENV: 'staging' })).rejects.toThrow(/APP_ENV.*dev, test, prod.*staging/)
  })
})
