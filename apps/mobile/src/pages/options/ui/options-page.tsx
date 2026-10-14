import { MotionSwitch } from 'src/features/motion-switch'
import { ThemeSwitch } from 'src/features/theme-switch'

function OptionsPage() {
  return (
    <>
      <p>Options</p>
      <ThemeSwitch />
      <MotionSwitch />
    </>
  )
}

export default OptionsPage
