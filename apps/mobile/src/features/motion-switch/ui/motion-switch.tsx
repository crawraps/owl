import { type MotionStrength, Toggle, ToggleGroup, useTheme } from '@repo/ui'
import { strengths } from '../config/strengths'
import type { MotionSwitchProps } from '../model/properties'

function MotionSwitch(props: MotionSwitchProps) {
  const { motionStrength, setMotionStrength } = useTheme()

  return (
    <ToggleGroup<MotionStrength> aria-label='Motion' {...props} onValueChange={([next]) => next && setMotionStrength(next)} required value={[motionStrength]}>
      {strengths.map(item => (
        <Toggle key={item.value} value={item.value}>
          {item.label}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

export default MotionSwitch
