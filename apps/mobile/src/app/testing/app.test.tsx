import { afterEach, beforeEach, describe, expect, it } from '@rstest/core'
import { act, cleanup, render, screen } from '@testing-library/react'
import darkTheme from '../config/themes/dark.json'
import { App } from '../index'

function renderAt(path: string) {
  window.history.replaceState(null, '', path)
  return render(<App />)
}

function title() {
  return screen.getByRole('heading').textContent
}

describe('<App> routing', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('redirects / to /tabs/home', () => {
    renderAt('/')

    expect(window.location.pathname).toBe('/tabs/home')
    expect(title()).toBe('Home')
  })

  it('redirects /tabs to /tabs/home', () => {
    renderAt('/tabs')

    expect(window.location.pathname).toBe('/tabs/home')
  })

  it('opens a tab from a deep link', () => {
    renderAt('/tabs/options')

    expect(title()).toBe('Options')
  })

  it('shows a bare 404 for unknown paths', () => {
    renderAt('/nowhere')

    expect(screen.getByText('404')).toBeTruthy()
    expect(screen.queryByRole('navigation')).toBeNull()
  })

  it('shows a bare 404 for unknown tabs', () => {
    renderAt('/tabs/unknown')

    expect(screen.getByText('404')).toBeTruthy()
    expect(screen.queryByRole('navigation')).toBeNull()
  })

  it('switches tabs from the nav bar', () => {
    renderAt('/tabs/home')

    act(() => screen.getByRole('button', { name: 'Options' }).click())

    expect(window.location.pathname).toBe('/tabs/options')
    expect(title()).toBe('Options')
  })
})

describe('<App> theming', () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  it('applies the dark theme when selected on the options tab', () => {
    renderAt('/tabs/options')

    act(() => screen.getByRole('button', { name: 'Dark' }).click())

    expect(document.documentElement.style.getPropertyValue('--md-sys-color-primary')).toBe(darkTheme.palette.primary)
  })
})
