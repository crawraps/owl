import { spring } from 'animejs'
import type { Motion } from 'src/shared/theming'

type Transition = Motion['expressive']['default']['spatial']

export function springFrom(transition: Transition) {
  return spring({ bounce: transition.bounce, duration: transition.duration })
}
