import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Hero } from './Hero'

vi.mock('@scalpelpoe/plugin-sdk', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

describe('Hero', () => {
  it('renders title, subtitle, save slot, and a working reload', () => {
    const onReload = vi.fn()
    render(<Hero title=".ini Editor" subtitle="sub text" save={<span>SAVE</span>} onReload={onReload} />)
    expect(screen.getByText('.ini Editor')).toBeTruthy()
    expect(screen.getByText('sub text')).toBeTruthy()
    expect(screen.getByText('SAVE')).toBeTruthy()
    fireEvent.click(screen.getByText('Reload'))
    expect(onReload).toHaveBeenCalledOnce()
  })
})
