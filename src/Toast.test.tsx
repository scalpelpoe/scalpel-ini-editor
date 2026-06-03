import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toast } from './Toast'

describe('Toast', () => {
  it('renders the message and reflects visibility', () => {
    const { rerender } = render(<Toast visible={false} message="hi there" />)
    const el = screen.getByText('hi there')
    expect(el.style.opacity).toBe('0')
    rerender(<Toast visible message="hi there" />)
    expect(el.style.opacity).toBe('1')
  })
})
