// @rstest-environment happy-dom

import { describe, expect, it } from '@rstest/core'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { memoryLocation } from 'wouter/memory-location'
import { Route, Router, Switch, TabProvider, Tabs, useTabController } from '../src/index'

function renderWithRouter(ui: React.ReactNode, path = '/') {
  const loc = memoryLocation({ path, static: false })
  return render(<Router hook={loc.hook}>{ui}</Router>)
}

describe('<Route>', () => {
  it('renders children when path matches', () => {
    renderWithRouter(React.createElement(Route, { path: '/' }, React.createElement('div', null, 'matched')))
    expect(screen.getByText('matched')).toBeTruthy()
  })

  it('does not render children when path does not match', () => {
    renderWithRouter(React.createElement(Route, { path: '/other' }, React.createElement('div', null, 'not matched')))
    expect(screen.queryByText('not matched')).toBeNull()
  })

  it('renders children unconditionally when no path given', () => {
    renderWithRouter(React.createElement(Route, null, React.createElement('div', null, 'always')))
    expect(screen.getByText('always')).toBeTruthy()
  })

  it('renders component when component prop given', () => {
    function TestComponent() {
      return React.createElement('div', null, 'from component')
    }
    renderWithRouter(React.createElement(Route, { path: '/', component: TestComponent }))
    expect(screen.getByText('from component')).toBeTruthy()
  })
})

describe('<Switch>', () => {
  it('renders default route when none match', () => {
    renderWithRouter(
      React.createElement(
        Switch,
        null,
        React.createElement(Route, { path: '/a' }, React.createElement('div', null, 'route a')),
        React.createElement(Route, null, React.createElement('div', null, 'default')),
      ),
    )
    expect(screen.getByText('default')).toBeTruthy()
  })
})

describe('<Tabs> validation', () => {
  it('throws when child is not a Route', () => {
    expect(() => {
      renderWithRouter(React.createElement(Tabs, null, React.createElement('div', null, 'not a route')))
    }).toThrow('<Tabs> only accepts <Route> elements as direct children')
  })

  it('throws when Route has no path', () => {
    expect(() => {
      renderWithRouter(React.createElement(Tabs, null, React.createElement(Route, null, React.createElement('div', null, 'no path'))))
    }).toThrow('<Route> inside <Tabs> must have a path')
  })

  it('throws on duplicate paths', () => {
    expect(() => {
      renderWithRouter(
        React.createElement(
          Tabs,
          null,
          React.createElement(Route, { path: '/a' }, React.createElement('div', null, 'a')),
          React.createElement(Route, { path: '/a' }, React.createElement('div', null, 'a dup')),
        ),
      )
    }).toThrow('duplicate path')
  })
})

describe('<TabProvider> + <Tabs> integration', () => {
  it('provides useTabController to children', () => {
    let captured: { activeTab: string; canGoBack: boolean } | null = null
    function Consumer() {
      const ctrl = useTabController()
      captured = { activeTab: ctrl.activeTab, canGoBack: ctrl.canGoBack }
      return null
    }

    renderWithRouter(
      React.createElement(TabProvider, null, React.createElement(Tabs, null, React.createElement(Route, { default: true, path: '/home' }, React.createElement(Consumer)))),
      '/home',
    )

    expect(captured).not.toBeNull()
    expect(captured?.activeTab).toBe('/home')
    expect(captured?.canGoBack).toBe(false)
  })

  it('auto-creates TabProvider when not provided', () => {
    renderWithRouter(React.createElement(Tabs, null, React.createElement(Route, { default: true, path: '/home' }, React.createElement('div', null, 'auto provider'))), '/home')
  })
})
