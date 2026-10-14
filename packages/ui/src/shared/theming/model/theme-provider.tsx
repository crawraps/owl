import { useLayoutEffect, useMemo } from 'react'
import { useTernaryDarkMode } from 'usehooks-ts'
import { applyThemeToCss } from '../lib/apply-to-css'
import { resolveThemes } from '../lib/resolve-themes'
import type { ThemeContextValue, ThemeProviderProps } from './properties'
import { ThemeContext } from './theme-context'

const SCHEME_STORAGE_KEY = 'muir-color-scheme'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const themes = useMemo(() => resolveThemes(props.themes, props.bind), [props.themes, props.bind])
  const { isDarkMode, ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode({ localStorageKey: SCHEME_STORAGE_KEY })

  const mode = isDarkMode ? 'dark' : 'light'
  const theme = themes[mode]

  useLayoutEffect(() => {
    applyThemeToCss(theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => ({ theme, mode, scheme: ternaryDarkMode, setScheme: setTernaryDarkMode }), [theme, mode, ternaryDarkMode, setTernaryDarkMode])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
