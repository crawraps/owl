import { createContext, useContext } from 'react'
import type { TabController, TabEntry } from '../model/types'

export const TabControllerContext = createContext<TabController | undefined>(undefined)

export type TabRegistry = {
  registerTabs: (tabs: TabEntry[]) => void
}

export const TabRegistryContext = createContext<TabRegistry | undefined>(undefined)

export function useTabController(): TabController {
  const ctx = useContext(TabControllerContext)
  if (ctx === undefined) {
    throw new Error('useTabController must be used within a <TabProvider> or <Tabs> component')
  }
  return ctx
}

export function useGoBack(): () => void {
  const ctx = useContext(TabControllerContext)
  return () => {
    if (ctx) ctx.goBack()
  }
}
