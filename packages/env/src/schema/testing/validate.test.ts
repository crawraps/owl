import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { defineEnv } from '../model/define-env'
import { validateEnv } from '../model/validate'

function at(value: string, line = 1, file = '.env/base') {
  return { value, file, line }
}

describe('validateEnv', () => {
  it('returns JSON code for the parsed schema output', () => {
    const schema = defineEnv(z.object({ URL: z.url(), PORT: z.coerce.number(), DEBUG: z.stringbool(), NAME: z.string().optional() }))
    expect(validateEnv(schema, { URL: at('https://a.b'), PORT: at('8080'), DEBUG: at('true') })).toEqual({
      define: { URL: '"https://a.b"', PORT: '8080', DEBUG: 'true', NAME: 'undefined' },
      issues: [],
    })
  })

  it('reports keys missing from the schema at their location', () => {
    const schema = defineEnv(z.object({ URL: z.string() }))
    expect(validateEnv(schema, { URL: at('x'), URL_TYPO: at('y', 2, '.env/dev') }).issues).toEqual([{ file: '.env/dev', line: 2, message: expect.stringContaining('URL_TYPO') }])
  })

  it('reports schema failures at the location of the failing value without printing it', () => {
    const schema = defineEnv(z.object({ PORT: z.coerce.number().int(), URL: z.url() }))
    const { issues } = validateEnv(schema, { PORT: at('secret-ish', 3, '.env/prod.local') })
    expect(issues).toEqual([{ file: '.env/prod.local', line: 3, message: expect.stringMatching(/^PORT: /) }, { message: expect.stringMatching(/^URL: /) }])
    expect(JSON.stringify(issues)).not.toContain('secret-ish')
  })

  it('reserves APP_ENV', () => {
    const schema = defineEnv(z.object({ APP_ENV: z.string() }))
    expect(validateEnv(schema, { APP_ENV: at('dev') }).issues).toEqual([
      { message: expect.stringContaining('APP_ENV') },
      { file: '.env/base', line: 1, message: expect.stringContaining('APP_ENV') },
    ])
  })

  it('rejects output that cannot be inlined as JSON', () => {
    const schema = defineEnv(z.object({ WHEN: z.string().transform(value => new Date(value)), N: z.string().transform(() => Number.POSITIVE_INFINITY) }))
    expect(validateEnv(schema, { WHEN: at('2026-01-01'), N: at('1', 2) }).issues).toEqual([
      { file: '.env/base', line: 1, message: expect.stringContaining('WHEN') },
      { file: '.env/base', line: 2, message: expect.stringContaining('N') },
    ])
  })
})
