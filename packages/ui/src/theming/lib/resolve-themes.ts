import { fallbackTheme } from '../config/fallback-theme'
import type { DeepPartial, Theme, ThemeBinding, ThemeMode } from '../model/properties'

const defaultBinding: ThemeBinding = { light: 'light', dark: 'dark' }

function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item) && typeof item === 'object' && !Array.isArray(item)
}

function mergeDeep(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target }

  for (const [key, value] of Object.entries(source)) {
    const current = result[key]
    result[key] = isObject(value) && isObject(current) ? mergeDeep(current, value) : value
  }

  return result
}

export function mergeTheme(base: Theme, partial?: DeepPartial<Theme>): Theme {
  if (!partial) return base
  return mergeDeep(base as unknown as Record<string, unknown>, partial as Record<string, unknown>) as unknown as Theme
}

export function resolveThemes(themes: Record<string, DeepPartial<Theme>> = {}, bind: Partial<ThemeBinding> = {}): Record<ThemeMode, Theme> {
  const binding = { ...defaultBinding, ...bind }

  return {
    light: mergeTheme(fallbackTheme, themes[binding.light]),
    dark: mergeTheme(fallbackTheme, themes[binding.dark]),
  }
}
