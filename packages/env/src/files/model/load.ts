import { readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import type { EnvIssue } from 'src/error'
import { interpolate } from './interpolate'
import { type EnvEntry, parseEnvFile } from './parse'

export interface EnvValue {
  value: string
  file: string
  line: number
}

interface LoadOptions {
  dir: string
  appEnv: string
  os: Record<string, string | undefined>
}

async function readOptional(path: string): Promise<string | undefined> {
  return readFile(path, 'utf8').catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return undefined
    throw error
  })
}

export async function loadEnvFiles({ dir, appEnv, os }: LoadOptions): Promise<{ values: Record<string, EnvValue>; issues: EnvIssue[] }> {
  const names = ['base', 'base.local', appEnv, `${appEnv}.local`]
  const texts = await Promise.all(names.map(name => readOptional(join(dir, name))))
  const issues: EnvIssue[] = []
  const winners = new Map<string, EnvEntry>()

  names.forEach((name, index) => {
    const text = texts[index]
    if (text === undefined) return
    const parsed = parseEnvFile(text, join(basename(dir), name))
    issues.push(...parsed.issues)
    for (const entry of parsed.entries) winners.set(entry.key, entry)
  })

  const values: Record<string, EnvValue> = {}
  for (const { key, value, literal, file, line } of winners.values()) {
    if (literal) {
      values[key] = { value, file, line }
      continue
    }
    const result = interpolate(value, os)
    issues.push(...result.errors.map(message => ({ file, line, message })))
    values[key] = { value: result.value, file, line }
  }
  return { values, issues }
}
