import type { HTMLAttributes, Ref } from 'react'

export interface TopBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  title?: string
  ref?: Ref<HTMLElement>
}
