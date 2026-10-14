import type { z } from 'zod'

export type EnvSchema = z.ZodObject

export type EnvOutput<T extends EnvSchema> = z.output<T>

export function defineEnv<T extends EnvSchema>(schema: T): T {
  return schema
}
