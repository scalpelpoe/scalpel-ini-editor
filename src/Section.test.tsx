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
})
