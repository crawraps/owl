import type { TabItem } from 'src/shared/model'

export function isKnownTab(location: string, tabs: readonly TabItem[]): boolean {
  return tabs.some(tab => location === tab.path || location.startsWith(`${tab.path}/`))
}
