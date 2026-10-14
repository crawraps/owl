import { BottomBar } from 'src/entities/bottom-bar'
import type { NavBarProps } from '../model/properties'
import { useNavBar } from '../model/use-nav-bar'

function NavBar(props: NavBarProps) {
  const navBar = useNavBar()
  return <BottomBar {...props} {...navBar} />
}

export default NavBar
