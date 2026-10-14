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

export type Motion = Record<'expressive' | 'standart', Record<'fast' | 'default' | 'slow', Record<'effects' | 'spatial', Transition>>>

export interface SurfaceLightConfig {
  surfaceScale: number
  elevation: number
  specularity: number
}

export interface SurfaceGrainConfig {
  density: number
  opacity: number
  light: SurfaceLightConfig
}

export interface SurfaceConfig {
  type: 'plain' | 'crust'
  blur: number
  opacity: number
  grain: SurfaceGrainConfig
}

export interface Theme {
  palette: ColorPalette
  /**
   * Border radius values in rem
   */
  shape: Shape
  typeface: Typeface
  motion: Motion
  surface: SurfaceConfig
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
