import { useCallback } from 'react'
import { useTabController } from './tab-context'
import { useTabLocationStore } from './tab-location-store'

export type WouterLocationHook = () => [string, (to: string, options?: { replace?: boolean }) => void]

export function useTabLocation(tabPath: string): [string, (to: string, options?: { replace?: boolean }) => void] {
  const controller = useTabController()
  const store = useTabLocationStore()
  const isActive = controller.activeTab === tabPath

  const location = isActive ? controller.scopedLocation : (store.get(tabPath) ?? tabPath)

  const navigate = useCallback(
    (to: string, _options?: { replace?: boolean }) => {
      if (isActive) {
        controller.scopedNavigate(to)
      } else {
        store.set(tabPath, to)
      }
    },
    [isActive, controller, store, tabPath],
  )

  return [location, navigate]
}

export function createTabLocationHook(tabPath: string): WouterLocationHook {
  return function useScopedTabLocation() {
    return useTabLocation(tabPath)
  }
}
