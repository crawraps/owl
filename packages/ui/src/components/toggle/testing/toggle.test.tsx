import { afterEach, describe, expect, it, rstest } from '@rstest/core'
import { act, cleanup, render, screen } from '@testing-library/react'
import Toggle from '../ui/toggle'

describe('<Toggle>', () => {
  afterEach(() => {
    cleanup()
  })

  it('is named by its label only once', () => {
    render(<Toggle>Bold</Toggle>)

    expect(screen.getByRole('button', { name: 'Bold' })).toBeTruthy()
  })

  it('toggles its pressed state', () => {
    const onPressedChange = rstest.fn()
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>)
    const button = screen.getByRole('button')

    act(() => button.click())

    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('keeps consumer classes', () => {
    render(<Toggle className='custom'>Bold</Toggle>)

    expect(screen.getByRole('button').classList.contains('custom')).toBe(true)
  })
})
