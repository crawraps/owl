import { Route, Tabs } from '@repo/navigation'
import { NotFoundPage } from 'src/pages/not-found'
import { Layout } from '../../layout'
import { tabs } from '../config/tabs'
import { TabsProviders } from '../model/tabs-providers'
import { useIsKnownTab } from '../model/use-is-known-tab'

function TabsRouting() {
  const isKnownTab = useIsKnownTab()

  if (!isKnownTab) return <NotFoundPage />

  return (
    <TabsProviders>
      <Layout>
        <Tabs>
          {tabs.map((tab, index) => (
            <Route default={index === 0} key={tab.path} path={tab.path}>
              <tab.page />
            </Route>
          ))}
        </Tabs>
      </Layout>
    </TabsProviders>
  )
}

export default TabsRouting
