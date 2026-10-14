import type { ComponentType } from 'react'
import { HomePage } from 'src/pages/home'
import { OptionsPage } from 'src/pages/options'
import type { TabItem } from 'src/shared/model'

export interface TabRoute extends TabItem {
  page: ComponentType
}

export const TABS_PREFIX = '/tabs'

export const tabs = [
  { path: '/home', title: 'Home', page: HomePage },
  { path: '/options', title: 'Options', page: OptionsPage },
] as const satisfies readonly TabRoute[]

export const DEFAULT_TAB_PATH = `${TABS_PREFIX}${tabs[0].path}`
