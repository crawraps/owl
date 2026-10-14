import type { ToggleGroup } from '@base-ui/react/toggle-group'
import { useState } from 'react'
import type { ToggleGroupProps } from './properties'

/**
 * Keeps the pressed values of both controlled and uncontrolled groups, so the group can always be controlled
 */
export function useGroupValue<Value extends string>({ value, defaultValue, onValueChange, required }: ToggleGroupProps<Value>) {
  const [uncontrolled, setUncontrolled] = useState<readonly Value[]>(defaultValue ?? [])
  const current = value ?? uncontrolled

  function handleValueChange(next: Value[], eventDetails: ToggleGroup.ChangeEventDetails) {
    if (required && next.length === 0) {
      eventDetails.cancel()
      return
    }

    onValueChange?.(next, eventDetails)
    if (!eventDetails.isCanceled) setUncontrolled(next)
  }

  return { value: current, onValueChange: handleValueChange }
}
