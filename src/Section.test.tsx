import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'

describe('Section', () => {
  it('is collapsed by default and toggles open on click', () => {
    render(<Section title="Display"><div>child</div></Section>)
    expect(screen.getByText('Display')).toBeTruthy()
    expect(screen.queryByText('child')).toBeNull()
    fireEvent.click(screen.getByText('Display'))
    expect(screen.getByText('child')).toBeTruthy()
  })
  it('forceOpen shows children regardless of internal state', () => {
    render(<Section title="Display" forceOpen><div>child</div></Section>)
    expect(screen.getByText('child')).toBeTruthy()
  })
  it('clicking while forceOpen does not corrupt manual state (stays collapsed once search clears)', () => {
    const { rerender } = render(
      <Section title="Display" forceOpen>
        <div>child</div>
      </Section>,
    )
    fireEvent.click(screen.getByText('Display'))
    rerender(
      <Section title="Display" forceOpen={false}>
        <div>child</div>
      </Section>,
    )
    expect(screen.queryByText('child')).toBeNull()
  })
})
