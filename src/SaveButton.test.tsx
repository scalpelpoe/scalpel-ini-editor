import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SaveButton } from './SaveButton'

describe('SaveButton', () => {
  it('shows Save / Saving... per state', () => {
    const { rerender } = render(<SaveButton dirty saving={false} onSave={() => {}} />)
    expect(screen.getByRole('button').textContent).toBe('Save')
    rerender(<SaveButton dirty saving onSave={() => {}} />)
    expect(screen.getByRole('button').textContent).toBe('Saving...')
  })
  it('is disabled and does not fire when clean', () => {
    const onSave = vi.fn()
    render(<SaveButton dirty={false} saving={false} onSave={onSave} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSave).not.toHaveBeenCalled()
  })
  it('fires onSave when dirty', () => {
    const onSave = vi.fn()
    render(<SaveButton dirty saving={false} onSave={onSave} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSave).toHaveBeenCalledOnce()
  })
})
