import { type Scope, utils } from 'animejs'
import { useEffect, useRef } from 'react'
import { AnimeScope, type AnimeScopeInit, springFrom } from 'src/shared/anime-scope'
import type { AnimatedProps } from '../model/properties'

function cornersOf(element: HTMLElement) {
  const style = getComputedStyle(element)
  return {
    borderTopLeftRadius: style.borderTopLeftRadius,
    borderTopRightRadius: style.borderTopRightRadius,
    borderBottomRightRadius: style.borderBottomRightRadius,
    borderBottomLeftRadius: style.borderBottomLeftRadius,
  }
}

function shapeOf(element: HTMLElement) {
  return { x: element.offsetLeft, width: element.offsetWidth, ...cornersOf(element) }
}

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
    utils.set(indicator!, pressed ? { ...shapeOf(pressed), opacity: 1 } : { opacity: 0 })
  }

  scope.add('move', () => {
    const pressed = findPressed()
    const fade = { duration: motion().standard.fast.effects.duration, ease: 'out' as const }

    if (!pressed) {
      visible = false
      animate(indicator, { opacity: 0, ...fade }, 'expressive')
    } else if (visible) {
      const corners = Object.fromEntries(Object.entries(cornersOf(pressed)).map(([corner, to]) => [corner, { to, ...fade }]))
      animate(indicator, { x: pressed.offsetLeft, width: pressed.offsetWidth, ...corners, ease: springFrom(motion().expressive.fast.spatial) }, 'expressive')
    } else {
      visible = true
      utils.set(indicator, shapeOf(pressed))
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
