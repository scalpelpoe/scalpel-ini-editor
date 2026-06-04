import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ValueControl } from './ValueControl'

vi.mock('@scalpelpoe/plugin-sdk', () => ({
  ScrubInput: ({ value, onChange }: any) => (
    <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />
  ),
  Slider: () => <div />,
  Textarea: () => <div />,
  TextInput: () => <div />,
}))
vi.mock('./KeyField', () => ({ KeyField: () => <div /> }))

describe('ValueControl', () => {
  it('number emits a string', () => {
    const onChange = vi.fn()
    render(<ValueControl control={{ kind: 'number', label: 'n' }} value="5" onChange={onChange} />)
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '7' } })
    expect(onChange).toHaveBeenCalledWith('7')
  })
  it('slider with an out-of-range value falls back to a number input', () => {
    render(<ValueControl control={{ kind: 'slider', label: 's', min: 0, max: 100 }} value="330" onChange={() => {}} />)
    expect(screen.getByRole('spinbutton')).toBeTruthy()
  })
})
