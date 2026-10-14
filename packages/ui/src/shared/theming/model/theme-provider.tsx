import { useLayoutEffect, useMemo } from 'react'
import { useTernaryDarkMode } from 'usehooks-ts'
import { applyMotionStrengthToCss, applyThemeToCss } from '../lib/apply-to-css'
import { resolveThemes } from '../lib/resolve-themes'
import type { ThemeContextValue, ThemeProviderProps } from './properties'
import { ThemeContext } from './theme-context'
import { useMotionStrength } from './use-motion-strength'

const SCHEME_STORAGE_KEY = 'muir-color-scheme'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const themes = useMemo(() => resolveThemes(props.themes, props.bind), [props.themes, props.bind])
  const { isDarkMode, ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode({ localStorageKey: SCHEME_STORAGE_KEY })
  const { motionStrength, setMotionStrength } = useMotionStrength(props.defaultMotionStrength)

  const mode = isDarkMode ? 'dark' : 'light'
  const theme = themes[mode]

  useLayoutEffect(() => {
    applyThemeToCss(theme)
  }, [theme])

  useLayoutEffect(() => {
    applyMotionStrengthToCss(motionStrength)
  }, [motionStrength])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, mode, scheme: ternaryDarkMode, setScheme: setTernaryDarkMode, motionStrength, setMotionStrength }),
    [theme, mode, ternaryDarkMode, setTernaryDarkMode, motionStrength, setMotionStrength],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}
