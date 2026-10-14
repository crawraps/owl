import { Children, isValidElement, type ReactElement, type ReactNode, useContext, useEffect, useMemo } from 'react'
import { Router, useLocation } from 'wouter'
import { isPathPrefix, joinPaths, normalizePath } from '../model/path'
import type { RouteProps, TabEntry, TabsProps } from '../model/types'
import { KeepAlive } from '../shared/keepalive'
import { useNestPrefix } from '../shared/nest-context'
import { TabRegistryContext } from '../shared/tab-context'
import { createTabLocationHook } from '../shared/use-tab-location'
import { TabProvider } from './tab-provider'

function isRouteElement(child: ReactNode): child is ReactElement<RouteProps> {
  if (!isValidElement(child)) return false
  if (typeof child.type === 'function') {
    const type = child.type as { name?: string; __isRoute?: boolean }
    if (type.__isRoute) return true
    if (type.name === 'Route') return true
  }
  const props = (child as ReactElement<Record<string, unknown>>).props
  return 'path' in props || 'default' in props || 'nest' in props
}

function collectTabs(children: ReactNode, parentPrefix: string): TabEntry[] {
  const tabs: TabEntry[] = []
  const seenPaths = new Set<string>()
  Children.forEach(children, child => {
    if (!isRouteElement(child)) {
      throw new Error('<Tabs> only accepts <Route> elements as direct children')
    }
    const props = child.props as RouteProps
    const path = props.path ?? ''
    if (path === '') {
      throw new Error('<Route> inside <Tabs> must have a path')
    }
    const normalized = normalizePath(path)
    if (seenPaths.has(normalized)) {
      throw new Error(`<Route> inside <Tabs> has duplicate path: "${normalized}"`)
    }
    seenPaths.add(normalized)
    tabs.push({
      path: normalized,
      absolutePath: joinPaths(parentPrefix, path),
      default: Boolean(props.default),
      element: child,
    })
  })
  return tabs
}

function TabPane({ tab, isActive }: { tab: TabEntry; isActive: boolean }) {
  const hook = useMemo(() => createTabLocationHook(tab.path), [tab.path])

  return (
    <Router hook={hook}>
      <KeepAlive active={isActive}>{tab.element}</KeepAlive>
    </Router>
  )
}

function TabsView({ children }: TabsProps) {
  const parentPrefix = useNestPrefix()
  const [scopedLocation] = useLocation()
  const tabs = useMemo(() => collectTabs(children, parentPrefix), [children, parentPrefix])
  const absoluteLocation = useMemo(() => joinPaths(parentPrefix, scopedLocation), [parentPrefix, scopedLocation])

  const activeTabPath = useMemo(() => {
    for (const tab of tabs) {
      if (isPathPrefix(tab.absolutePath, absoluteLocation)) return tab.path
    }
    const fallback = tabs.find(t => t.default) ?? tabs[0]
    return fallback?.path ?? ''
  }, [tabs, absoluteLocation])

  return (
    <>
      {tabs.map(tab => (
        <TabPane isActive={tab.path === activeTabPath} key={tab.path} tab={tab} />
      ))}
    </>
  )
}

function TabsWithProvider({ children }: TabsProps) {
  const parentPrefix = useNestPrefix()
  const tabs = useMemo(() => collectTabs(children, parentPrefix), [children, parentPrefix])
  const registry = useContext(TabRegistryContext)

  useEffect(() => {
    registry?.registerTabs(tabs)
  }, [registry, tabs])

  return <TabsView>{children}</TabsView>
}

export function Tabs(props: TabsProps) {
  const registry = useContext(TabRegistryContext)

  if (registry) {
    return <TabsWithProvider {...props} />
  }

  return (
    <TabProvider>
      <TabsWithProvider {...props} />
    </TabProvider>
  )
}
