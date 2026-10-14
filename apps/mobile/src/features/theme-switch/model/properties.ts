import type { ColorScheme, ToggleGroupProps } from '@repo/ui'

export interface ThemeSwitchProps extends Omit<ToggleGroupProps<ColorScheme>, 'children' | 'defaultValue' | 'onValueChange' | 'required' | 'value'> {}
