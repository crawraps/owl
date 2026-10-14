import { describe, expect, it } from '@rstest/core'
import { fallbackTheme } from '../config/fallback-theme'
import { mergeTheme, resolveThemes } from '../lib/resolve-themes'

describe('mergeTheme', () => {
  it('overrides only the provided keys', () => {
    const merged = mergeTheme(fallbackTheme, { palette: { primary: '#ff0000' } })

    expect(merged.palette.primary).toBe('#ff0000')
    expect(merged.palette.secondary).toBe(fallbackTheme.palette.secondary)
    expect(merged.shape).toEqual(fallbackTheme.shape)
  })

  it('does not mutate the base theme', () => {
    const primary = fallbackTheme.palette.primary

    mergeTheme(fallbackTheme, { palette: { primary: '#ff0000' } })

    expect(fallbackTheme.palette.primary).toBe(primary)
  })
})

describe('resolveThemes', () => {
  it('binds themes named light and dark automatically', () => {
    const resolved = resolveThemes({ light: { palette: { primary: '#111111' } }, dark: { palette: { primary: '#222222' } } })

    expect(resolved.light.palette.primary).toBe('#111111')
    expect(resolved.dark.palette.primary).toBe('#222222')
  })

  it('binds custom theme names', () => {
    const resolved = resolveThemes({ day: { palette: { primary: '#111111' } }, night: { palette: { primary: '#222222' } } }, { light: 'day', dark: 'night' })

    expect(resolved.light.palette.primary).toBe('#111111')
    expect(resolved.dark.palette.primary).toBe('#222222')
  })

  it('falls back to the fallback theme when a bound name is missing', () => {
    const resolved = resolveThemes({ light: { palette: { primary: '#111111' } } })

    expect(resolved.dark).toEqual(fallbackTheme)
  })
})
