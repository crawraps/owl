import type { Toggle } from '@base-ui/react/toggle'
import type { Ref } from 'react'

export interface ToggleProps<Value extends string = string> extends Omit<Toggle.Props<Value>, 'className'> {
  className?: string
  ref?: Ref<HTMLButtonElement>
}
