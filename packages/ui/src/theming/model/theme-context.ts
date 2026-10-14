import { createContext, useContext } from 'react'
import type { ThemeContextValue, ThemeMode } from './properties'

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function useSafeThemeMode(): ThemeMode {
  const context = useContext(ThemeContext)
  return context?.mode ?? 'dark'
}
