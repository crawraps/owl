import { afterEach, beforeEach, describe, expect, it, rstest } from '@rstest/core'
import { act, cleanup, render, screen } from '@testing-library/react'
import { Toggle } from 'src/components/toggle'
import { ThemeProvider } from 'src/shared/theming'
import type { ToggleGroupProps } from '../model/properties'
import ToggleGroup from '../ui/toggle-group'

function renderGroup(props: ToggleGroupProps) {
  return render(
    <ThemeProvider>
      <ToggleGroup aria-label='Size' {...props}>
        <Toggle value='s'>Small</Toggle>
        <Toggle value='m'>Medium</Toggle>
        <Toggle value='l'>Large</Toggle>
      </ToggleGroup>
    </ThemeProvider>,
  )
}

function pressed(name: string) {
  return screen.getByRole('button', { name }).getAttribute('aria-pressed') === 'true'
}

function click(name: string) {
  act(() => screen.getByRole('button', { name }).click())
}

describe('<ToggleGroup>', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('presses one item at a time when uncontrolled', () => {
    renderGroup({ defaultValue: ['s'] })

    click('Large')

    expect(pressed('Small')).toBe(false)
    expect(pressed('Large')).toBe(true)
  })

  it('reports value changes', () => {
    const onValueChange = rstest.fn()
    renderGroup({ defaultValue: ['s'], onValueChange })

    click('Medium')

    expect(onValueChange).toHaveBeenCalledWith(['m'], expect.anything())
  })

  it('follows the controlled value', () => {
    const onValueChange = rstest.fn()
    renderGroup({ value: ['m'], onValueChange })

    click('Large')

    expect(onValueChange).toHaveBeenCalledWith(['l'], expect.anything())
    expect(pressed('Medium')).toBe(true)
    expect(pressed('Large')).toBe(false)
  })

  it('releases the pressed item by default', () => {
    renderGroup({ defaultValue: ['s'] })

    click('Small')

    expect(pressed('Small')).toBe(false)
  })

  it('keeps the pressed item when required', () => {
    const onValueChange = rstest.fn()
    renderGroup({ defaultValue: ['s'], onValueChange, required: true })

    click('Small')

    expect(pressed('Small')).toBe(true)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('respects changes canceled by the consumer', () => {
    renderGroup({ defaultValue: ['s'], onValueChange: (_, details) => details.cancel() })

    click('Large')

    expect(pressed('Small')).toBe(true)
  })
})
