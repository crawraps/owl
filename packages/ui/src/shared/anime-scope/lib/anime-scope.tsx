import { animate, createScope, type Scope } from 'animejs'
import { cloneElement, useCallback, useEffect, useRef } from 'react'
import { useTheme } from 'src/shared/theming'
import type { AnimeScopeProps, AnimeScopeTools, AnimeScopeType } from '../model/properties'
import { isTierAllowed } from './is-tier-allowed'

function AnimeScope({ ref, init, children }: AnimeScopeProps) {
  const { theme, motionStrength } = useTheme()

  const scope = useRef<Scope>(null)
  const childRef = useRef<HTMLElement>(null)
  const forwardedRef = useRef(children.props.ref)
  forwardedRef.current = children.props.ref

  const motion = useRef(theme.motion)
  motion.current = theme.motion
  const strength = useRef(motionStrength)
  strength.current = motionStrength

  const setChildRef = useCallback((node: HTMLElement | null) => {
    childRef.current = node
    const ref = forwardedRef.current
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [])

  useEffect(() => {
    const currentScope = ref ?? scope
    const tools: AnimeScopeTools = {
      motion: () => motion.current,
      animate: (targets, params, tier) => {
        const animation = animate(targets, params)
        return isTierAllowed(tier, strength.current) ? animation : animation.complete()
      },
    }

    currentScope.current = createScope({ root: childRef.current ?? undefined })
    if (init) {
      currentScope.current.add(scope => init(scope as AnimeScopeType, tools))
    }

    return () => currentScope.current?.revert()
  }, [init, ref])

  return cloneElement(children, { ref: setChildRef })
}

export default AnimeScope
