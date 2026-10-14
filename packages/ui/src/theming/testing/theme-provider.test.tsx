import { afterEach, beforeEach, describe, expect, it } from '@rstest/core'
import { act, cleanup, render, renderHook, screen } from '@testing-library/react'
import { useSafeThemeMode, useTheme } from '../model/theme-context'
import { ThemeProvider } from '../model/theme-provider'

const themes = {
  light: { palette: { primary: '#111111' } },
  dark: { palette: { primary: '#222222' } },
}

function stubSystemScheme(scheme: 'light' | 'dark') {
  window.matchMedia = (query: string) =>
    ({
      matches: query === '(prefers-color-scheme: dark)' && scheme === 'dark',
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
  const { mode, scheme, setScheme } = useTheme()
  return (
    <div>
      <span data-testid='mode'>{mode}</span>
      <span data-testid='scheme'>{scheme}</span>
      <button onClick={() => setScheme('light')} type='button'>
        light
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
