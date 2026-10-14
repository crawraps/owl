import type { EnvIssue } from 'src/error'

export const appEnvs = ['dev', 'test', 'prod'] as const

export type AppEnv = (typeof appEnvs)[number]

function isAppEnv(value: string): value is AppEnv {
  return (appEnvs as readonly string[]).includes(value)
}

export function resolveAppEnv(value: string | undefined, action: string | undefined): AppEnv | EnvIssue {
  if (value === undefined || value === '') return action === 'dev' ? 'dev' : 'prod'
  if (isAppEnv(value)) return value
  return { message: `APP_ENV must be one of ${appEnvs.join(', ')}, received "${value}"` }
}
