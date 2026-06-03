import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { KeyField } from './KeyField'

vi.mock('@scalpelpoe/plugin-sdk', () => ({
  Button: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
}))

describe('KeyField', () => {
  it('records a key and preserves the trailing slot token', () => {
    const onChange = vi.fn()
    render(<KeyField value="81 2" onChange={onChange} />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    fireEvent.keyDown(btn, { keyCode: 87 })
    expect(onChange).toHaveBeenCalledWith('87 2')
  })
})
