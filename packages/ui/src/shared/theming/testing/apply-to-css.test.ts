import { afterEach, describe, expect, it } from '@rstest/core'
import { fallbackTheme } from '../config/fallback-theme'
import { applyThemeToCss } from '../lib/apply-to-css'

describe('applyThemeToCss', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style')
    document.head.innerHTML = ''
  })

  it('writes palette, shape and typescale tokens to the root element', () => {
    applyThemeToCss(fallbackTheme)
    const style = document.documentElement.style

    expect(style.getPropertyValue('--md-sys-color-primary')).toBe(fallbackTheme.palette.primary)
    expect(style.getPropertyValue('--md-sys-shape-corner-medium')).toBe(`${fallbackTheme.shape.medium}rem`)
    expect(style.getPropertyValue('--md-sys-typescale-body-small-size')).toBe(`${fallbackTheme.typeface.typeScale.body.small.size}rem`)
  })

  it('writes space, blur, opacity and layout tokens with their units', () => {
    applyThemeToCss(fallbackTheme)
    const style = document.documentElement.style

    expect(style.getPropertyValue('--md-sys-space-4')).toBe(`${fallbackTheme.space[4]}rem`)
    expect(style.getPropertyValue('--md-sys-blur-m')).toBe(`${fallbackTheme.blur.m}px`)
    expect(style.getPropertyValue('--md-sys-opacity-m')).toBe(`${fallbackTheme.opacity.m}`)
    expect(style.getPropertyValue('--md-sys-layout-pane-spacer')).toBe(`${fallbackTheme.layout.spacer}rem`)
  })

  it('composes glass levels from blur and opacity tokens', () => {
    applyThemeToCss(fallbackTheme)
    const style = document.documentElement.style
    const { blur, opacity } = fallbackTheme.glass.m

    expect(style.getPropertyValue('--md-sys-glass-m-blur')).toBe(`var(--md-sys-blur-${blur})`)
    expect(style.getPropertyValue('--md-sys-glass-m-opacity')).toBe(`var(--md-sys-opacity-${opacity})`)
  })

  it('writes the grain tile as an SVG data URL sized in rem', () => {
    applyThemeToCss(fallbackTheme)
    const style = document.documentElement.style

    expect(style.getPropertyValue('--md-sys-grain-texture')).toMatch(/^url\("data:image\/svg\+xml,/)
    expect(style.getPropertyValue('--md-sys-grain-size')).toBe(`${fallbackTheme.grain.tileSize}rem`)
  })

  it('injects the base stylesheet once', () => {
    applyThemeToCss(fallbackTheme)
    applyThemeToCss(fallbackTheme)

    expect(document.head.querySelectorAll('#muir-theme-base-style')).toHaveLength(1)
  })
})
