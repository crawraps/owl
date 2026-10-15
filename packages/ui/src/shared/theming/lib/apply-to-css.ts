import type { ColorPalette, Grain, Layout, MotionStrength, Shape, Space, Theme, Typeface } from '../model/properties'
import { grainTexture } from './grain-texture'

const css = `body{margin:0;background-color:var(--md-sys-color-background);color:var(--md-sys-color-on-background);font-family:var(--md-ref-typeface-plain);transition:background-color var(--md-sys-motion-expressive-fast-effects-transition),color var(--md-sys-motion-expressive-fast-effects-transition)}small{font-size:var(--md-sys-typescale-body-small-size);color:var(--md-sys-color-on-surface);opacity:.75}[muir-motion='none'] *,[muir-motion='none'] *::before,[muir-motion='none'] *::after{transition:none!important;animation:none!important}`

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

export function applyMotionStrengthToCss(strength: MotionStrength): void {
  document.documentElement.setAttribute('muir-motion', strength)
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

export function applySpaceToCss(space: Space): void {
  const root = document.documentElement

  for (const [key, value] of Object.entries(space)) {
    root.style.setProperty(`--md-sys-space-${key}`, `${value}rem`)
  }
}

export function applyBlurToCss(blur: Theme['blur']): void {
  const root = document.documentElement

  for (const [size, value] of Object.entries(blur)) {
    root.style.setProperty(`--md-sys-blur-${size}`, `${value}px`)
  }
}

export function applyOpacityToCss(opacity: Theme['opacity']): void {
  const root = document.documentElement

  for (const [size, value] of Object.entries(opacity)) {
    root.style.setProperty(`--md-sys-opacity-${size}`, value.toString())
  }
}

export function applyGlassToCss(glass: Theme['glass']): void {
  const root = document.documentElement

  for (const [size, level] of Object.entries(glass)) {
    root.style.setProperty(`--md-sys-glass-${size}-blur`, `var(--md-sys-blur-${level.blur})`)
    root.style.setProperty(`--md-sys-glass-${size}-opacity`, `var(--md-sys-opacity-${level.opacity})`)
  }
}

export function applyGrainToCss(grain: Grain): void {
  const root = document.documentElement

  root.style.setProperty('--md-sys-grain-texture', grainTexture(grain))
  root.style.setProperty('--md-sys-grain-size', `${grain.tileSize}rem`)
}

export function applyLayoutToCss(layout: Layout): void {
  const root = document.documentElement

  root.style.setProperty('--md-sys-layout-margin-compact', `${layout.margin.compact}rem`)
  root.style.setProperty('--md-sys-layout-margin-wide', `${layout.margin.wide}rem`)
  root.style.setProperty('--md-sys-layout-pane-spacer', `${layout.spacer}rem`)
  root.style.setProperty('--md-sys-layout-pane-fixed-expanded', `${layout.paneFixed.expanded}rem`)
  root.style.setProperty('--md-sys-layout-pane-fixed-large', `${layout.paneFixed.large}rem`)
  root.style.setProperty('--md-sys-layout-pane-min', `${layout.paneMin}rem`)
  root.style.setProperty('--md-sys-layout-rail-collapsed', `${layout.rail.collapsed}rem`)
  root.style.setProperty('--md-sys-layout-rail-expanded', `${layout.rail.expanded}rem`)
}

export function applyThemeToCss(theme: Theme): void {
  applyPaletteToCss(theme.palette)
  applyShapeToCss(theme.shape)
  applyTypefaceToCss(theme.typeface)
  applyMotionToCss(theme.motion)
  applySpaceToCss(theme.space)
  applyBlurToCss(theme.blur)
  applyOpacityToCss(theme.opacity)
  applyGlassToCss(theme.glass)
  applyGrainToCss(theme.grain)
  applyLayoutToCss(theme.layout)

  let stylesheet = document.getElementById(BASE_STYLE_ID) as HTMLStyleElement | null
  if (!stylesheet) {
    stylesheet = document.createElement('style')
    stylesheet.id = BASE_STYLE_ID
    document.head.prepend(stylesheet)
  }
  stylesheet.innerHTML = css
}
