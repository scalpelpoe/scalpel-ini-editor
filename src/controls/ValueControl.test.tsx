import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ValueControl } from './ValueControl'

vi.mock('@scalpelpoe/plugin-sdk', () => ({
  Toggle: ({ checked, onChange }: any) => <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />,
  ScrubInput: ({ value, onChange }: any) => <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />,
  Slider: () => <div />,
  SettingSelectBox: () => <div />,
  Textarea: () => <div />,
  TextInput: () => <div />,
}))
vi.mock('./KeyField', () => ({ KeyField: () => <div /> }))

describe('ValueControl', () => {
  it('toggle emits "true"/"false" strings', () => {
    const onChange = vi.fn()
    render(<ValueControl control={{ kind: 'toggle', label: 'f' }} value="false" onChange={onChange} />)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledWith('true')
  })
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
