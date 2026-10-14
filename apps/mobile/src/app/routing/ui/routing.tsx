import { Redirect, Route, Switch } from '@repo/navigation'
import { NotFoundPage } from 'src/pages/not-found'
import { DEFAULT_TAB_PATH, TABS_PREFIX } from '../config/tabs'
import TabsRouting from './tabs-routing'

function Routing() {
  return (
    <Switch>
      <Route path='/'>
        <Redirect replace to={DEFAULT_TAB_PATH} />
      </Route>
      <Route path={TABS_PREFIX}>
        <Redirect replace to={DEFAULT_TAB_PATH} />
      </Route>
      <Route nest path={TABS_PREFIX}>
        <TabsRouting />
      </Route>
      <Route>
        <NotFoundPage />
      </Route>
    </Switch>
  )
}

export default Routing
