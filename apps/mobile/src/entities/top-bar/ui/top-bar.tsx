import type { TopBarProps } from '../model/properties'

function TopBar({ title, ...props }: TopBarProps) {
  return (
    <header {...props} className={cx('root', props.className)}>
      <h1 className={cx('title')}>{title}</h1>
    </header>
  )
}

export default TopBar
