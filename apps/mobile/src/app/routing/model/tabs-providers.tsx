import { TabProvider } from '@repo/navigation'
import type { ReactNode } from 'react'
import { TabsContext } from 'src/shared/model'
import { tabs } from '../config/tabs'

export function TabsProviders({ children }: { children?: ReactNode }) {
  return (
    <TabProvider>
      <TabsContext value={tabs}>{children}</TabsContext>
    </TabProvider>
  )
}
