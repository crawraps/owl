import { Router } from '@repo/navigation'
import { ThemeProvider } from '@repo/ui'
import dark from './config/themes/dark.json'
import light from './config/themes/light.json'
import { Routing } from './routing'
import './ui/global.css'

const themes = { light, dark }

export function App() {
  return (
    <ThemeProvider themes={themes}>
      <Router>
        <Routing />
      </Router>
    </ThemeProvider>
  )
}
