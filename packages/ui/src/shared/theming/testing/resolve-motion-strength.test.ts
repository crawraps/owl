import { describe, expect, it } from '@rstest/core'
import { isMotionStrength, resolveMotionStrength } from '../lib/resolve-motion-strength'

describe('resolveMotionStrength', () => {
  it.each([
    [null, 'full', false, 'full'],
    [null, 'full', true, 'reduced'],
    [null, 'reduced', false, 'reduced'],
    [null, 'none', true, 'none'],
    ['full', 'none', true, 'full'],
    ['none', 'full', false, 'none'],
  ] as const)('selected %s, fallback %s, prefers reduced %s -> %s', (selected, fallback, prefersReducedMotion, expected) => {
    expect(resolveMotionStrength(selected, fallback, prefersReducedMotion)).toBe(expected)
  })
})

describe('isMotionStrength', () => {
  it.each([
    ['full', true],
    ['reduced', true],
    ['none', true],
    ['fast', false],
    [null, false],
  ])('%s -> %s', (value, expected) => {
    expect(isMotionStrength(value)).toBe(expected)
  })
})
