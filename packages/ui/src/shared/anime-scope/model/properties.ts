import type { AnimationParams, JSAnimation, Scope, TargetsParam } from 'animejs'
import type { ReactElement, RefObject } from 'react'
import type { Motion } from 'src/shared/theming'

/**
 * - `expressive` — decorative motion, runs only with `full` motion strength
 * - `accessibility` — interaction feedback (hover, press, focus), runs with `full` and `reduced` motion strength
 */
export type MotionTier = 'expressive' | 'accessibility'

export interface AnimeScopeTools {
  /**
   * Returns motion tokens of the current theme
   */
  motion: () => Motion
  /**
   * Animates according to the current motion strength. Animations that are not allowed jump to their final values
   */
  animate: (targets: TargetsParam, params: AnimationParams, tier: MotionTier) => JSAnimation
}

export type AnimeScopeType = Scope & { root: HTMLElement }

export type AnimeScopeInit = (scope: AnimeScopeType, tools: AnimeScopeTools) => void

export interface AnimeScopeProps {
  // biome-ignore lint/suspicious/noExplicitAny: Accepts any React element
  children: ReactElement<any>
  /**
   * Current anime scope
   */
  ref?: RefObject<Scope | null>
  /**
   * Function to initialize the scope with. Must be stable, the scope is recreated when it changes
   */
  init?: AnimeScopeInit
}
