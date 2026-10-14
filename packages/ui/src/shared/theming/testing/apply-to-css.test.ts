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

  it('injects the base stylesheet once', () => {
    applyThemeToCss(fallbackTheme)
    applyThemeToCss(fallbackTheme)

    expect(document.head.querySelectorAll('#muir-theme-base-style')).toHaveLength(1)
  })
})
