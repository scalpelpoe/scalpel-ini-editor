import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScrollToastHeader } from './ScrollToastHeader'

describe('ScrollToastHeader', () => {
  it('renders children and is hidden when not collapsed', () => {
    const { rerender } = render(<ScrollToastHeader collapsed={false}><span>save</span></ScrollToastHeader>)
    const bar = screen.getByText('save').parentElement as HTMLElement
    expect(bar.style.opacity).toBe('0')
    expect(bar.style.pointerEvents).toBe('none')
    rerender(<ScrollToastHeader collapsed><span>save</span></ScrollToastHeader>)
    expect(bar.style.opacity).toBe('1')
    expect(bar.style.pointerEvents).toBe('auto')
  })
})
