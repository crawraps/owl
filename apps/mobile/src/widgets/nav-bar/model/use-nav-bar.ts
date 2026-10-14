import { useTabController } from '@repo/navigation'
import type { BottomBarItem } from 'src/entities/bottom-bar'
import { useTabs } from 'src/shared/model'

export function useNavBar() {
  const tabs = useTabs()
  const { activeTab, switchTo } = useTabController()

  const items: BottomBarItem[] = tabs.map(tab => ({ value: tab.path, label: tab.title }))

  return { items, active: activeTab, onSelect: switchTo }
}
