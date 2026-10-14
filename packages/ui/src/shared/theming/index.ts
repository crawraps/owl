export { fallbackTheme } from './config/fallback-theme'
export { applyThemeToCss } from './lib/apply-to-css'
export { mergeTheme, resolveThemes } from './lib/resolve-themes'
export type {
  ColorPalette,
  ColorScheme,
  DeepPartial,
  Motion,
  Shape,
  SurfaceConfig,
  Theme,
  ThemeBinding,
  ThemeContextValue,
  ThemeMode,
  ThemeProviderProps,
  Typeface,
} from './model/properties'
export { useSafeThemeMode, useTheme } from './model/theme-context'
export { ThemeProvider } from './model/theme-provider'
