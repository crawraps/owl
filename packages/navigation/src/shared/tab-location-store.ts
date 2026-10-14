import { createContext, useContext } from 'react'

export interface TabLocationStoreValue {
  get(tabPath: string): string | undefined
  set(tabPath: string, location: string): void
}

export const TabLocationStoreContext = createContext<TabLocationStoreValue | undefined>(undefined)

export function useTabLocationStore(): TabLocationStoreValue {
  const ctx = useContext(TabLocationStoreContext)
  if (ctx === undefined) {
    throw new Error('useTabLocationStore must be used within a <TabProvider>')
  }
  return ctx
}
