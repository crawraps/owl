import { defineEnv } from '@repo/env'
import { z } from 'zod'

export const envSchema = defineEnv(
  z.object({
    API_ROUTE: z.string().startsWith('/'),
  }),
)
