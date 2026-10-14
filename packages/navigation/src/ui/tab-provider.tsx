import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useLocation } from 'wouter'
import { computeBack, createTabHistory, tabHistoryReducer } from '../model/history'
import { isPathPrefix } from '../model/path'
import type { TabController, TabEntry, TabProviderProps } from '../model/types'
import { TabControllerContext, TabRegistryContext } from '../shared/tab-context'
import { TabLocationStoreContext, type TabLocationStoreValue } from '../shared/tab-location-store'

export function TabProvider({ children }: TabProviderProps) {
  const [history, dispatch] = useReducer(tabHistoryReducer, null, createTabHistory)
  const [registeredTabs, setRegisteredTabs] = useState<TabEntry[]>([])
  const [scopedLocation, navigate] = useLocation()
  const storeRef = useRef<Record<string, string>>({})

  const registerTabs = useCallback((tabs: TabEntry[]) => {
    setRegisteredTabs(prev => {
      if (prev.length === tabs.length && prev.every((t, i) => t.path === tabs[i].path)) return prev
      return tabs
    })
  }, [])

  const registry = useMemo(() => ({ registerTabs }), [registerTabs])

  const activeTab = useMemo(() => {
    if (history.activeTab !== null) return history.activeTab
    const defaultTab = registeredTabs.find(t => t.default) ?? registeredTabs[0]
    return defaultTab?.path ?? ''
  }, [history.activeTab, registeredTabs])

  const store = useMemo<TabLocationStoreValue>(
    () => ({
      get(tabPath: string) {
        return storeRef.current[tabPath]
      },
      set(tabPath: string, location: string) {
        if (storeRef.current[tabPath] !== location) {
          storeRef.current = { ...storeRef.current, [tabPath]: location }
        }
      },
    }),
    [],
  )

  useEffect(() => {
    if (registeredTabs.length === 0) return

    for (const tab of registeredTabs) {
      if (storeRef.current[tab.path] === undefined) {
        storeRef.current[tab.path] = tab.path
      }
    }

    if (history.activeTab === null) {
      const matchingTab = registeredTabs.find(t => isPathPrefix(t.path, scopedLocation))
      const defaultTab = matchingTab ?? registeredTabs.find(t => t.default) ?? registeredTabs[0]
      if (defaultTab) {
        dispatch({ type: 'init', tabId: defaultTab.path, path: scopedLocation })
        if (matchingTab) {
          storeRef.current = { ...storeRef.current, [defaultTab.path]: scopedLocation }
        }
      }
    }
  }, [registeredTabs, history.activeTab, scopedLocation])

  useEffect(() => {
    if (history.activeTab === null || registeredTabs.length === 0) return
    const activeEntry = registeredTabs.find(t => t.path === history.activeTab)
    if (!activeEntry) return
    if (isPathPrefix(activeEntry.path, scopedLocation)) {
      if (storeRef.current[history.activeTab] !== scopedLocation) {
        storeRef.current = { ...storeRef.current, [history.activeTab]: scopedLocation }
      }
      dispatch({ type: 'pushLocation', tabId: history.activeTab, path: scopedLocation })
    }
  }, [scopedLocation, history.activeTab, registeredTabs])

  const switchTo = useCallback(
    (tabPath: string) => {
      const tab = registeredTabs.find(t => t.path === tabPath)
      if (!tab) return
      const stored = storeRef.current[tabPath] ?? tab.path
      dispatch({ type: 'switchTab', tabId: tabPath, path: stored })
      navigate(stored)
    },
    [registeredTabs, navigate],
  )

  const goBack = useCallback(() => {
    const result = computeBack(history)
    if (!result) return
    dispatch({ type: 'applyBack', result })
    navigate(result.path)
  }, [history, navigate])

  const canGoBack = useMemo(() => computeBack(history) !== null, [history])

  const controller = useMemo<TabController>(
    () => ({
      activeTab,
      scopedLocation,
      scopedNavigate: navigate,
      switchTo,
      goBack,
      canGoBack,
    }),
    [activeTab, scopedLocation, navigate, switchTo, goBack, canGoBack],
  )

  return (
    <TabRegistryContext value={registry}>
      <TabLocationStoreContext value={store}>
        <TabControllerContext value={controller}>{children}</TabControllerContext>
      </TabLocationStoreContext>
    </TabRegistryContext>
  )
}
