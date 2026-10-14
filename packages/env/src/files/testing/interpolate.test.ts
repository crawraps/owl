import { describe, expect, it } from 'vitest'
import { interpolate } from '../model/interpolate'

const os = { HOST: 'example.com', EMPTY: '' }

describe('interpolate', () => {
  it('substitutes ${VAR} from the OS environment', () => {
    expect(interpolate('https://${HOST}/v1', os)).toEqual({ value: 'https://example.com/v1', errors: [] })
  })

  it('treats a set but empty variable as set', () => {
    expect(interpolate('a${EMPTY}b', os)).toEqual({ value: 'ab', errors: [] })
  })

  it('reports unset variables', () => {
    expect(interpolate('${MISSING}/${ALSO_MISSING}', os).errors).toEqual([expect.stringContaining('MISSING'), expect.stringContaining('ALSO_MISSING')])
  })

  it('unescapes \\${ and \\\\', () => {
    expect(interpolate('\\${HOST} \\\\${HOST}', os)).toEqual({ value: '${HOST} \\example.com', errors: [] })
  })

  it('keeps other dollars and backslashes literal', () => {
    expect(interpolate('pa$$word $HOST C:\\dir', os)).toEqual({ value: 'pa$$word $HOST C:\\dir', errors: [] })
  })

  it.each(['${HOST', '${}', '${1X}', '${A-B}'])('reports malformed reference %j', value => {
    expect(interpolate(value, os).errors).toEqual([expect.stringContaining('Invalid reference')])
  })
})
