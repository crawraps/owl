import { TopBar } from 'src/entities/top-bar'
import type { StatusBarProps } from '../model/properties'
import { useStatusBar } from '../model/use-status-bar'

function StatusBar(props: StatusBarProps) {
  const statusBar = useStatusBar()
  return <TopBar {...props} {...statusBar} />
}

export default StatusBar
