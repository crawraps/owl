import type { HTMLAttributes, Ref } from 'react'

export interface BottomBarItem {
  value: string
  label: string
}

export interface BottomBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'children'> {
  items: readonly BottomBarItem[]
  active?: string
  onSelect?: (value: string) => void
  ref?: Ref<HTMLElement>
}
