import { Toggle as BaseToggle } from '@base-ui/react/toggle'
import type { ToggleProps } from '../model/properties'

function Toggle<Value extends string>({ children, ...props }: ToggleProps<Value>) {
  return (
    <BaseToggle {...props} className={cx('root', props.className)}>
      <span className={cx('label')}>
        <span className={cx('text')}>{children}</span>
        <span aria-hidden className={cx('reserve')}>
          {children}
        </span>
      </span>
    </BaseToggle>
  )
}

export default Toggle
