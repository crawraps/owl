import type { EnvIssue } from 'src/error'
import type { EnvValue } from 'src/files'
import type { EnvSchema } from './define-env'

const reserved = 'APP_ENV'

function isInlinable(value: unknown): boolean {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (Array.isArray(value)) return value.every(isInlinable)
  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) return Object.values(value).every(isInlinable)
  return false
}

function located(values: Record<string, EnvValue>, key: string | undefined, message: string): EnvIssue {
  const source = key === undefined ? undefined : values[key]
  return source ? { file: source.file, line: source.line, message } : { message }
}

export function validateEnv(schema: EnvSchema, values: Record<string, EnvValue>): { define: Record<string, string>; issues: EnvIssue[] } {
  const issues: EnvIssue[] = []
  const keys = Object.keys(schema.shape)

  if (keys.includes(reserved)) {
    issues.push({ message: `${reserved} is provided by @repo/env, remove it from the schema` })
  }
  for (const key of Object.keys(values)) {
    if (key === reserved) issues.push(located(values, key, `${reserved} is selected by the APP_ENV variable, not by .env files`))
    else if (!keys.includes(key)) issues.push(located(values, key, `${key} is not declared in the env schema`))
  }

  const input = Object.fromEntries(Object.entries(values).flatMap(([key, { value }]) => (keys.includes(key) && key !== reserved ? [[key, value]] : [])))
  const result = (keys.includes(reserved) ? schema.omit({ [reserved]: true }) : schema).safeParse(input)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0]
      issues.push(located(values, typeof key === 'string' ? key : undefined, `${issue.path.join('.')}: ${issue.message}`))
    }
    return { define: {}, issues }
  }

  const define: Record<string, string> = {}
  for (const key of keys) {
    if (key === reserved) continue
    const value: unknown = result.data[key]
    if (value === undefined) define[key] = 'undefined'
    else if (isInlinable(value)) define[key] = JSON.stringify(value)
    else issues.push(located(values, key, `${key}: parsed value cannot be inlined, the schema must output JSON-compatible data`))
  }
  return { define, issues }
}
