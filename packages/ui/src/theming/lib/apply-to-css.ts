import type { ColorPalette, Shape, SurfaceConfig, Theme, Typeface } from '../model/properties'

const css = `body{margin:0;background-color:var(--md-sys-color-background);color:var(--md-sys-color-on-background);font-family:var(--md-ref-typeface-plain);transition:background-color var(--md-sys-motion-expressive-fast-effects-transition),color var(--md-sys-motion-expressive-fast-effects-transition)}small{font-size:var(--md-sys-typescale-body-small-size);color:var(--md-sys-color-on-surface);opacity:.75}`

const BASE_STYLE_ID = 'muir-theme-base-style'

export function applyPaletteToCss(palette: ColorPalette): void {
  const root = document.documentElement

  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(`--md-sys-color-${key}`, value)
  }
}

export function applyShapeToCss(shape: Shape): void {
  const root = document.documentElement

  for (const [key, value] of Object.entries(shape)) {
    root.style.setProperty(`--md-sys-shape-corner-${key}`, `${value}rem`)
  }
}

export function applyMotionToCss(motion: Theme['motion']): void {
  const root = document.documentElement

  for (const [style, value] of Object.entries(motion)) {
    for (const [speed, val] of Object.entries(value)) {
      for (const [type, v] of Object.entries(val)) {
        root.style.setProperty(`--md-sys-motion-${style}-${speed}-${type}-duration`, `${v.duration}ms`)
        root.style.setProperty(`--md-sys-motion-${style}-${speed}-${type}-curve`, v.curve)
        root.style.setProperty(`--md-sys-motion-${style}-${speed}-${type}-transition`, `${v.duration}ms ${v.curve}`)
      }
    }
  }
}

export function applyTypefaceToCss(typography: Typeface): void {
  const root = document.documentElement
  root.style.setProperty('--md-ref-typeface-brand', typography.brandFamily)
  root.style.setProperty('--md-ref-typeface-plain', typography.plainFamily)
  root.style.setProperty('--md-ref-typeface-monospace', typography.monospaceFamily)

  for (const [scale, sizes] of Object.entries(typography.typeScale)) {
    for (const [size, props] of Object.entries(sizes)) {
      root.style.setProperty(`--md-sys-typescale-${scale}-${size}-size`, `${props.size}rem`)
      root.style.setProperty(`--md-sys-typescale-${scale}-${size}-line-height`, `${props.lineHeight}em`)
      root.style.setProperty(`--md-sys-typescale-${scale}-${size}-weight`, props.weight.toString())
    }
  }
}

export function applySurfaceToCss(surface: SurfaceConfig): void {
  const root = document.documentElement

  root.style.setProperty('--md-sys-surface-type', surface.type)
  root.style.setProperty('--md-sys-surface-blur', `${surface.blur}px`)
  root.style.setProperty('--md-sys-surface-opacity', surface.opacity.toString())
  root.style.setProperty('--md-sys-surface-grain-density', surface.grain.density.toString())
  root.style.setProperty('--md-sys-surface-grain-opacity', surface.grain.opacity.toString())
  root.style.setProperty('--md-sys-surface-grain-light-surface-scale', surface.grain.light.surfaceScale.toString())
  root.style.setProperty('--md-sys-surface-grain-light-elevation', surface.grain.light.elevation.toString())
  root.style.setProperty('--md-sys-surface-grain-light-specularity', surface.grain.light.specularity.toString())
}

export function applyThemeToCss(theme: Theme): void {
  applyPaletteToCss(theme.palette)
  applyShapeToCss(theme.shape)
  applyTypefaceToCss(theme.typeface)
  applyMotionToCss(theme.motion)
  applySurfaceToCss(theme.surface)

  let stylesheet = document.getElementById(BASE_STYLE_ID) as HTMLStyleElement | null
  if (!stylesheet) {
    stylesheet = document.createElement('style')
    stylesheet.id = BASE_STYLE_ID
    document.head.prepend(stylesheet)
  }
  stylesheet.innerHTML = css
}
