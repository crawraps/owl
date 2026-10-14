import { createContext, useContext } from 'react'

export interface TabItem {
  path: string
  title: string
}

export const TabsContext = createContext<readonly TabItem[]>([])

export function useTabs(): readonly TabItem[] {
  return useContext(TabsContext)
}
