import { NavBar } from 'src/widgets/nav-bar'
import { StatusBar } from 'src/widgets/status-bar'
import type { LayoutProps } from '../model/properties'

function Layout({ children }: LayoutProps) {
  return (
    <div className={cx('root')}>
      <StatusBar />
      <main className={cx('content')}>{children}</main>
      <NavBar />
    </div>
  )
}

export default Layout
