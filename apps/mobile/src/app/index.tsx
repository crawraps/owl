import { Router } from '@repo/navigation'
import { type DeepPartial, type Theme, ThemeProvider } from '@repo/ui'
import dark from './config/themes/dark.json'
import light from './config/themes/light.json'
import { Routing } from './routing'
import '@fontsource-variable/crimson-pro/wght.css'
import '@fontsource-variable/crimson-pro/wght-italic.css'
import '@fontsource-variable/instrument-sans/standard.css'
import '@fontsource-variable/inconsolata/standard.css'
import './ui/global.css'

const themes = { light, dark } as Record<string, DeepPartial<Theme>>

export function App() {
  return (
    <ThemeProvider themes={themes}>
      <Router>
        <Routing />
      </Router>
    </ThemeProvider>
  )
}
