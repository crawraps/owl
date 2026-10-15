import type { ReactNode } from 'react'

export interface Shape {
  none: number
  'extra-small': number
  small: number
  medium: number
  large: number
  'extra-large': number
  full: number
}

type TypeScale = 'display' | 'headline' | 'title' | 'body' | 'label'
type TypeScaleSize = 'small' | 'medium' | 'large'

export interface Typeface {
  brandFamily: string
  plainFamily: string
  monospaceFamily: string
  typeScale: Record<
    TypeScale,
    Record<
      TypeScaleSize,
      {
        /**
         * Font size in rem
         */
        size: number
        /**
         * Line height in em
         */
        lineHeight: number
        weight: number
      }
    >
  >
}

type Transition = {
  duration: number
  curve: string
  bounce: number
}

export type Motion = Record<'expressive' | 'standard', Record<'fast' | 'default' | 'slow', Record<'effects' | 'spatial', Transition>>>

export type Space = Record<1 | 2 | 4 | 6 | 10 | 16 | 32, number>

export type Size = 'xs' | 's' | 'm' | 'l' | 'xl'

export interface GlassLevel {
  blur: Size
  opacity: Size
}

/**
 * Noise baked into blurred things. Never laid over text or crisp edges
 */
export interface Grain {
  /**
   * Peak alpha of a speck, 0–1
   */
  opacity: number
  /**
   * feTurbulence baseFrequency: higher is finer grain
   */
  frequency: number
  /**
   * feTurbulence numOctaves: 1 is even film grain, 2–3 clump it
   */
  octaves: number
  /**
   * Speck colour: light specks read on dark images, dark specks on light ones
   */
  tone: 'light' | 'dark'
  /**
   * Size of the repeating noise tile in rem
   */
  tileSize: number
}

export type WindowClass = 'compact' | 'medium' | 'expanded' | 'large' | 'extraLarge'

/**
 * Material 3 window size classes and panes. Lengths in rem
 */
export interface Layout {
  /**
   * Minimum width of each class; compact is everything below medium
   */
  breakpoints: Record<Exclude<WindowClass, 'compact'>, number>
  margin: { compact: number; wide: number }
  /**
   * Most panes shown side by side, per class
   */
  maxPanes: Record<WindowClass, number>
  /**
   * Gap between panes
   */
  spacer: number
  /**
   * Width of a fixed pane (the list in list-detail)
   */
  paneFixed: { expanded: number; large: number }
  paneMin: number
  rail: { collapsed: number; expanded: number }
  paneShape: keyof Shape
}

export interface Theme {
  palette: ColorPalette
  /**
   * Border radius values in rem
   */
  shape: Shape
  typeface: Typeface
  motion: Motion
  /**
   * Spacing values in rem
   */
  space: Space
  /**
   * Blur radii in px
   */
  blur: Record<Size, number>
  /**
   * Opacity values, 0–1
   */
  opacity: Record<Size, number>
  /**
   * Translucent containers composed from a blur and an opacity
   */
  glass: Record<Size, GlassLevel>
  grain: Grain
  layout: Layout
}

export interface ColorPalette {
  primary: string
  'on-primary': string
  'on-primary-fixed': string
  'on-primary-fixed-variant': string
  background: string
  'on-background': string
  'primary-container': string
  'on-primary-container': string
  secondary: string
  'on-secondary': string
  'on-secondary-fixed': string
  'on-secondary-fixed-variant': string
  'secondary-container': string
  'on-secondary-container': string
  tertiary: string
  'on-tertiary': string
  'on-tertiary-fixed': string
  'on-tertiary-fixed-variant': string
  'tertiary-container': string
  'on-tertiary-container': string
  error: string
  'on-error': string
  'error-container': string
  'on-error-container': string
  surface: string
  'on-surface': string
  'surface-variant': string
  'on-surface-variant': string
  outline: string
  'outline-variant': string
  shadow: string
  scrim: string
  'inverse-surface': string
  'inverse-on-surface': string
  'inverse-primary': string
  'surface-dim': string
  'surface-bright': string
  'surface-container-lowest': string
  'surface-container-low': string
  'surface-container': string
  'surface-container-high': string
  'surface-container-highest': string
  'primary-fixed': string
  'primary-fixed-dim': string
  'secondary-fixed': string
  'secondary-fixed-dim': string
  'surface-tint': string
  'tertiary-fixed': string
  'tertiary-fixed-dim': string
}

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

export type ThemeMode = 'light' | 'dark'

export type ColorScheme = ThemeMode | 'system'

export type ThemeBinding = Record<ThemeMode, string>

/**
 * How impactful animations are:
 * - `full` — every animation runs
 * - `reduced` — only accessibility feedback (hover, press, focus) runs
 * - `none` — no animation runs
 */
export type MotionStrength = 'full' | 'reduced' | 'none'

export interface ThemeProviderProps {
  children?: ReactNode
  /**
   * Named partial themes merged over the fallback theme
   */
  themes?: Record<string, DeepPartial<Theme>>
  /**
   * Theme names used for each mode. Defaults to `light` and `dark`
   */
  bind?: Partial<ThemeBinding>
  /**
   * Motion strength used until the user picks one. The OS reduced motion preference can only lower it. Defaults to `full`
   */
  defaultMotionStrength?: MotionStrength
}

export interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  scheme: ColorScheme
  setScheme: (scheme: ColorScheme) => void
  motionStrength: MotionStrength
  setMotionStrength: (strength: MotionStrength) => void
}
