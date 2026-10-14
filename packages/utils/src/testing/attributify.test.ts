import { describe, expect, it } from 'vitest'
import { atr, attributify } from '../attributify'

describe('attributify', () => {
  it.each([
    [true, ''],
    [false, undefined],
    [null, undefined],
    [undefined, undefined],
    ['', ''],
    ['primary', 'primary'],
    [0, '0'],
    [Number.NaN, 'NaN'],
  ] as const)('converts %j to %j', (value, expected) => {
    expect(attributify(value)).toBe(expected)
  })

  it('exports atr as an alias', () => {
    expect(atr).toBe(attributify)
  })
})
