import type { BottomBarProps } from 'src/entities/bottom-bar'

export type NavBarProps = Omit<BottomBarProps, 'items' | 'active' | 'onSelect'>
