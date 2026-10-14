import { atr } from '@repo/utils'
import type { BottomBarProps } from '../model/properties'

function BottomBar({ items, active, onSelect, ...props }: BottomBarProps) {
  return (
    <nav {...props} className={cx('root', props.className)}>
      {items.map(item => (
        <button
          aria-current={item.value === active ? 'page' : undefined}
          className={cx('item')}
          is-active={atr(item.value === active)}
          key={item.value}
          onClick={() => onSelect?.(item.value)}
          type='button'
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

export default BottomBar
