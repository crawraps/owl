import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group'
import type { ToggleGroupProps } from '../model/properties'
import { useGroupValue } from '../model/use-group-value'
import { Animated } from './animation'

function ToggleGroup<Value extends string>({ children, required, ...props }: ToggleGroupProps<Value>) {
  const group = useGroupValue({ ...props, required })

  return (
    <Animated pressed={group.value[0]}>
      <BaseToggleGroup {...props} className={cx('root', props.className)} defaultValue={undefined} onValueChange={group.onValueChange} value={group.value}>
        <span aria-hidden className={cx('indicator')} muir-indicator='' />
        {children}
      </BaseToggleGroup>
    </Animated>
  )
}

export default ToggleGroup
