import type { HTMLAttributes, Ref } from 'react'

export interface ThemeSwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: Ref<HTMLDivElement>
}
