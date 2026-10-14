import { useTheme } from '@repo/ui'
import { schemes } from '../config/schemes'
import type { ThemeSwitchProps } from '../model/properties'

function ThemeSwitch(props: ThemeSwitchProps) {
  const { scheme, setScheme } = useTheme()

  return (
    <div {...props}>
      {schemes.map(item => (
        <button aria-pressed={item.value === scheme} key={item.value} onClick={() => setScheme(item.value)} type='button'>
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default ThemeSwitch
