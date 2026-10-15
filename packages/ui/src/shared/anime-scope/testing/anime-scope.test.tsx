import { afterEach, beforeEach, describe, expect, it, rstest } from '@rstest/core'
import { cleanup, render } from '@testing-library/react'
import type { Scope } from 'animejs'
import { createRef } from 'react'
import { type MotionStrength, ThemeProvider } from 'src/shared/theming'
import AnimeScope from '../lib/anime-scope'
import { isTierAllowed } from '../lib/is-tier-allowed'
import type { AnimeScopeInit, AnimeScopeTools } from '../model/properties'

function renderScope(init: AnimeScopeInit, motionStrength: MotionStrength = 'full', ref = createRef<Scope | null>()) {
  return render(
    <ThemeProvider defaultMotionStrength={motionStrength}>
      <AnimeScope init={init} ref={ref}>
        <div data-testid='root' />
      </AnimeScope>
    </ThemeProvider>,
  )
}

function captureTools(motionStrength: MotionStrength) {
  let tools: AnimeScopeTools | undefined
  renderScope((_, t) => {
    tools = t
  }, motionStrength)
  return tools!
}

describe('<AnimeScope>', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('creates the scope on the child element', () => {
    const init = rstest.fn<AnimeScopeInit>()
    const { getByTestId } = renderScope(init)

    expect(init).toHaveBeenCalledTimes(1)
    expect(init.mock.calls[0]?.[0].root).toBe(getByTestId('root'))
  })

  it('reverts the scope on unmount', () => {
    const ref = createRef<Scope | null>()
    const { unmount } = renderScope(() => {}, 'full', ref)
    const revert = rstest.spyOn(ref.current!, 'revert')

    unmount()

    expect(revert).toHaveBeenCalledTimes(1)
  })

  it('forwards the child ref', () => {
    const childRef = createRef<HTMLDivElement>()
    render(
      <ThemeProvider>
        <AnimeScope>
          <div data-testid='root' ref={childRef} />
        </AnimeScope>
      </ThemeProvider>,
    )

    expect(childRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it('provides motion tokens of the current theme', () => {
    const tools = captureTools('full')

    expect(tools.motion().expressive.fast.spatial.duration).toBeGreaterThan(0)
  })

  it('runs allowed animations over time', () => {
    const target = { x: 0 }
    captureTools('full').animate(target, { x: 10, duration: 1000 }, 'expressive')

    expect(target.x).toBe(0)
  })

  it('jumps to the final values of animations that are not allowed', () => {
    const target = { x: 0 }
    captureTools('reduced').animate(target, { x: 10, duration: 1000 }, 'expressive')

    expect(target.x).toBe(10)
  })
})

describe('isTierAllowed', () => {
  it.each([
    ['expressive', 'full', true],
    ['accessibility', 'full', true],
    ['expressive', 'reduced', false],
    ['accessibility', 'reduced', true],
    ['expressive', 'none', false],
    ['accessibility', 'none', false],
  ] as const)('%s with %s strength -> %s', (tier, strength, expected) => {
    expect(isTierAllowed(tier, strength)).toBe(expected)
  })
})
