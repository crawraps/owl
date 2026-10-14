import { describe, expect, it } from 'vitest'
import { createSmartClsx } from '../smart-clsx'

const smartClsx = createSmartClsx({ active: 'active_hash', root: 'root_hash', track: 'track_hash' })

describe('createSmartClsx', () => {
  it('resolves whitespace-separated module class names', () => {
    expect(smartClsx('root track')).toBe('root_hash track_hash')
  })

  it('resolves nested arrays and conditional object keys', () => {
    expect(smartClsx(['root', ['track', { active: true, missing: true }]])).toBe('root_hash track_hash active_hash')
  })

  it('omits unknown module keys and empty values', () => {
    expect(smartClsx(['missing', { missing: true, active: false }, null, false, ''])).toBe('')
  })

  it('forwards later arguments as global classes without module resolution', () => {
    expect(smartClsx('root', 'global', { selected: true })).toBe('root_hash global selected')
  })
})
