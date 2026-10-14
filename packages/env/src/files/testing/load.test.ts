import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { loadEnvFiles } from '../model/load'

const directories: string[] = []

async function envDir(files: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), 'repo-env-'))
  directories.push(root)
  const dir = join(root, '.env')
  await mkdir(dir)
  await Promise.all(Object.entries(files).map(([name, text]) => writeFile(join(dir, name), text)))
  return dir
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

describe('loadEnvFiles', () => {
  it('layers base, base.local, <env> and <env>.local in that order', async () => {
    const dir = await envDir({
      base: 'A=base\nB=base\nC=base\nD=base',
      'base.local': 'B=base.local\nC=base.local\nD=base.local',
      dev: 'C=dev\nD=dev',
      'dev.local': 'D=dev.local',
      prod: 'A=prod',
    })
    const { values, issues } = await loadEnvFiles({ dir, appEnv: 'dev', os: {} })
    expect(issues).toEqual([])
    expect(values).toEqual({
      A: { value: 'base', file: '.env/base', line: 1 },
      B: { value: 'base.local', file: '.env/base.local', line: 1 },
      C: { value: 'dev', file: '.env/dev', line: 1 },
      D: { value: 'dev.local', file: '.env/dev.local', line: 1 },
    })
  })

  it('treats every file and the directory itself as optional', async () => {
    expect(await loadEnvFiles({ dir: await envDir({}), appEnv: 'prod', os: {} })).toEqual({ values: {}, issues: [] })
    expect(await loadEnvFiles({ dir: join(tmpdir(), 'repo-env-missing'), appEnv: 'prod', os: {} })).toEqual({ values: {}, issues: [] })
  })

  it('interpolates only the winning value from the OS environment', async () => {
    const dir = await envDir({ base: 'URL=${UNSET}', dev: "URL=https://${HOST}\nRAW='${HOST}'" })
    const { values, issues } = await loadEnvFiles({ dir, appEnv: 'dev', os: { HOST: 'example.com' } })
    expect(issues).toEqual([])
    expect(values.URL?.value).toBe('https://example.com')
    expect(values.RAW?.value).toBe('${HOST}')
  })

  it('collects parse and interpolation issues from all files with locations', async () => {
    const dir = await envDir({ base: 'bad line', dev: 'OK=1\nURL=${UNSET}' })
    const { issues } = await loadEnvFiles({ dir, appEnv: 'dev', os: {} })
    expect(issues).toEqual([
      { file: '.env/base', line: 1, message: expect.stringContaining('Invalid line') },
      { file: '.env/dev', line: 2, message: expect.stringContaining('UNSET') },
    ])
  })
})
