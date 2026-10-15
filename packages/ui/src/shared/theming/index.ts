export { fallbackTheme } from './config/fallback-theme'
export { applyThemeToCss } from './lib/apply-to-css'
export { mergeTheme, resolveThemes } from './lib/resolve-themes'
export type {
  ColorPalette,
  ColorScheme,
  DeepPartial,
  GlassLevel,
  Grain,
  Layout,
  Motion,
  MotionStrength,
  Shape,
  Size,
  Space,
  Theme,
  ThemeBinding,
  ThemeContextValue,
  ThemeMode,
  ThemeProviderProps,
  Typeface,
  WindowClass,
} from './model/properties'
export { useSafeThemeMode, useTheme } from './model/theme-context'
export { ThemeProvider } from './model/theme-provider'
