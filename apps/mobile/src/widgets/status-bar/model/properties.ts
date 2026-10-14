import type { TopBarProps } from 'src/entities/top-bar'

export type StatusBarProps = Omit<TopBarProps, 'title'>
