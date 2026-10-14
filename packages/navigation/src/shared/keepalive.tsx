import type { ReactNode } from 'react'
import { Freeze } from 'react-freeze'

export function KeepAlive({ active, children }: { active: boolean; children: ReactNode }) {
  return <Freeze freeze={!active}>{children}</Freeze>
}
