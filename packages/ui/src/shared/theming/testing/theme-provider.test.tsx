import { afterEach, beforeEach, describe, expect, it } from '@rstest/core'
import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import { useSafeThemeMode, useTheme } from '../model/theme-context'
import { ThemeProvider } from '../model/theme-provider'

const themes = {
  light: { palette: { primary: '#111111' } },
  dark: { palette: { primary: '#222222' } },
}

function stubSystemScheme(scheme: 'light' | 'dark', reducedMotion = false) {
  window.matchMedia = (query: string) =>
    ({
      matches: (query === '(prefers-color-scheme: dark)' && scheme === 'dark') || (query === '(prefers-reduced-motion: reduce)' && reducedMotion),
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

function Probe() {
  const { mode, scheme, setScheme, motionStrength, setMotionStrength } = useTheme()
  return (
    <div>
      <span data-testid='mode'>{mode}</span>
      <span data-testid='scheme'>{scheme}</span>
      <span data-testid='motion'>{motionStrength}</span>
      <button onClick={() => setScheme('light')} type='button'>
        light
      </button>
      <button onClick={() => setMotionStrength('none')} type='button'>
        no motion
      </button>
    </div>
  )
}

function primaryColor() {
  return document.documentElement.style.getPropertyValue('--md-sys-color-primary')
}

describe('<ThemeProvider>', () => {
  beforeEach(() => {
    localStorage.clear()
    stubSystemScheme('dark')
  })

  afterEach(() => {
    cleanup()
    document.documentElement.removeAttribute('style')
    document.documentElement.removeAttribute('muir-motion')
  })

  it('follows the system scheme by default', () => {
    render(
      <ThemeProvider themes={themes}>
        <Probe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('scheme').textContent).toBe('system')
    expect(screen.getByTestId('mode').textContent).toBe('dark')
    expect(primaryColor()).toBe('#222222')
  })

  it('applies an explicitly selected scheme', () => {
    render(
      <ThemeProvider themes={themes}>
        <Probe />
      </ThemeProvider>,
    )

    act(() => screen.getByText('light').click())

    expect(screen.getByTestId('mode').textContent).toBe('light')
    expect(primaryColor()).toBe('#111111')
  })

  it('remembers the selected scheme across mounts', () => {
    const first = render(
      <ThemeProvider themes={themes}>
        <Probe />
      </ThemeProvider>,
    )
    act(() => screen.getByText('light').click())
    first.unmount()

    render(
      <ThemeProvider themes={themes}>
        <Probe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('scheme').textContent).toBe('light')
  })

  it('uses custom bindings for named themes', () => {
    render(
      <ThemeProvider bind={{ dark: 'night' }} themes={{ night: { palette: { primary: '#333333' } } }}>
        <Probe />
      </ThemeProvider>,
    )

    expect(primaryColor()).toBe('#333333')
  })
})

describe('<ThemeProvider> motion strength', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    document.documentElement.removeAttribute('muir-motion')
  })

  function motionAttribute() {
    return document.documentElement.getAttribute('muir-motion')
  }

  it('defaults to full motion', () => {
    stubSystemScheme('dark')
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('motion').textContent).toBe('full')
    expect(motionAttribute()).toBe('full')
  })

  it('reduces motion when the OS asks for it', () => {
    stubSystemScheme('dark', true)
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    expect(motionAttribute()).toBe('reduced')
  })

  it('uses the provided default', () => {
    stubSystemScheme('dark', true)
    render(
      <ThemeProvider defaultMotionStrength='none'>
        <Probe />
      </ThemeProvider>,
    )

    expect(motionAttribute()).toBe('none')
  })

  it('applies and remembers the selected strength', () => {
    stubSystemScheme('dark')
    const first = render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    act(() => screen.getByText('no motion').click())

    expect(motionAttribute()).toBe('none')
    first.unmount()

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('motion').textContent).toBe('none')
  })

  it('ignores an invalid stored strength', () => {
    stubSystemScheme('dark')
    localStorage.setItem('muir-motion-strength', JSON.stringify('fast'))
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )

    expect(motionAttribute()).toBe('full')
  })
})

describe('useTheme', () => {
  it('throws outside of a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow('useTheme must be used within a ThemeProvider')
  })
})

describe('useSafeThemeMode', () => {
  it('returns dark outside of a ThemeProvider', () => {
    const { result } = renderHook(() => useSafeThemeMode())

    expect(result.current).toBe('dark')
  })
})
