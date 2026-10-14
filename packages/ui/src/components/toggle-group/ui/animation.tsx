import { type Scope, utils } from 'animejs'
import { useEffect, useRef } from 'react'
import { AnimeScope, type AnimeScopeInit, springFrom } from 'src/shared/anime-scope'
import type { AnimatedProps } from '../model/properties'

const init: AnimeScopeInit = (scope, { animate, motion }) => {
  const indicator = scope.root.querySelector<HTMLElement>('[muir-indicator]')
  if (!indicator) return
  let visible = false

  function findPressed() {
    return scope.root.querySelector<HTMLElement>('[data-pressed]')
  }

  function place() {
    const pressed = findPressed()
    visible = pressed !== null
    utils.set(indicator!, pressed ? { x: pressed.offsetLeft, width: pressed.offsetWidth, opacity: 1 } : { opacity: 0 })
  }

  scope.add('move', () => {
    const pressed = findPressed()
    const fade = { duration: motion().standart.fast.effects.duration, ease: 'out' as const }

    if (!pressed) {
      visible = false
      animate(indicator, { opacity: 0, ...fade }, 'expressive')
    } else if (visible) {
      animate(indicator, { x: pressed.offsetLeft, width: pressed.offsetWidth, ease: springFrom(motion().expressive.fast.spatial) }, 'expressive')
    } else {
      visible = true
      utils.set(indicator, { x: pressed.offsetLeft, width: pressed.offsetWidth })
      animate(indicator, { opacity: 1, ...fade }, 'expressive')
    }
  })

  place()
  const observer = new ResizeObserver(place)
  observer.observe(scope.root)
  return () => observer.disconnect()
}

export function Animated({ pressed, children }: AnimatedProps) {
  const scope = useRef<Scope>(null)
  const mounted = useRef(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: Moves the indicator when the pressed item changes
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    scope.current?.methods.move?.()
  }, [pressed])

  return (
    <AnimeScope init={init} ref={scope}>
      {children}
    </AnimeScope>
  )
}
