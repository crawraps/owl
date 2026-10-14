import type { ComponentType, ReactNode } from 'react'
import { useRoute, Route as WouterRoute } from 'wouter'
import { joinPaths, normalizePath } from '../model/path'
import { NestContext, useNestPrefix } from '../shared/nest-context'

interface RouteComponentProps {
  path?: string
  nest?: boolean
  default?: boolean
  children?: ReactNode
  component?: ComponentType<Record<string, unknown>>
}

function RouteInner({ children, component: Component }: RouteComponentProps) {
  if (Component) {
    return <Component />
  }
  return <>{children}</>
}

export function Route(props: RouteComponentProps) {
  const parentPrefix = useNestPrefix()
  const { nest, path = '' } = props
  const fullPrefix = nest ? joinPaths(parentPrefix, path) : parentPrefix

  if (path === '' || path === undefined) {
    return (
      <NestContext value={{ prefix: fullPrefix }}>
        <RouteInner {...props} />
      </NestContext>
    )
  }

  return (
    <NestContext value={{ prefix: normalizePath(fullPrefix) }}>
      <WouterRoute nest={nest} path={path}>
        <RouteInner {...props} />
      </WouterRoute>
    </NestContext>
  )
}

;(Route as { __isRoute?: boolean }).__isRoute = true
Route.displayName = 'Route'

export { useRoute }
