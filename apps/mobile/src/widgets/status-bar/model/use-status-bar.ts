import { useTabController } from '@repo/navigation'
import { useTabs } from 'src/shared/model'

export function useStatusBar() {
  const tabs = useTabs()
  const { activeTab } = useTabController()

  return { title: tabs.find(tab => tab.path === activeTab)?.title }
}
