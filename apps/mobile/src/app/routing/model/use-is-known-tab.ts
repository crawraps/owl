import { useLocation } from '@repo/navigation'
import { tabs } from '../config/tabs'
import { isKnownTab } from '../lib/is-known-tab'

export function useIsKnownTab(): boolean {
  const [location] = useLocation()
  return isKnownTab(location, tabs)
}
