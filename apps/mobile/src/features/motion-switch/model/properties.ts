import type { MotionStrength, ToggleGroupProps } from '@repo/ui'

export interface MotionSwitchProps extends Omit<ToggleGroupProps<MotionStrength>, 'children' | 'defaultValue' | 'onValueChange' | 'required' | 'value'> {}
