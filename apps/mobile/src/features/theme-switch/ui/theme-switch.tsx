import { type ColorScheme, Toggle, ToggleGroup, useTheme } from '@repo/ui'
import { schemes } from '../config/schemes'
import type { ThemeSwitchProps } from '../model/properties'

function ThemeSwitch(props: ThemeSwitchProps) {
  const { scheme, setScheme } = useTheme()

  return (
    <ToggleGroup<ColorScheme> aria-label='Theme' {...props} onValueChange={([next]) => next && setScheme(next)} required value={[scheme]}>
      {schemes.map(item => (
        <Toggle key={item.value} value={item.value}>
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

export default ThemeSwitch
