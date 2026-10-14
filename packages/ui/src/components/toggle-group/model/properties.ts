import type { ToggleGroup } from '@base-ui/react/toggle-group'
import type { ReactElement, Ref } from 'react'

export interface ToggleGroupProps<Value extends string = string> extends Omit<ToggleGroup.Props<Value>, 'className' | 'multiple'> {
  className?: string
  /**
   * Keeps one item pressed: pressing the pressed item does not release it
   */
  required?: boolean
  ref?: Ref<HTMLDivElement>
}

export interface AnimatedProps {
  /**
   * Value of the pressed item, the indicator moves when it changes
   */
  pressed: string | undefined
  // biome-ignore lint/suspicious/noExplicitAny: Accepts any React element
  children: ReactElement<any>
}
