import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

vi.mock('@scalpelpoe/plugin-sdk', () => ({
  Notice: ({ title }: any) => <div>{title}</div>,
  ErrorBanner: ({ message }: any) => <div>{`err:${message}`}</div>,
  TextInput: (p: any) => <input placeholder={p.placeholder} value={p.value} onChange={p.onChange} />,
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))
vi.mock('./controls/ValueControl', () => ({
  ValueControl: ({ value, onChange }: any) => <input aria-label="val" value={value} onChange={(e) => onChange(e.target.value)} />,
}))
vi.mock('./Section', () => ({ Section: ({ children }: any) => <div>{children}</div> }))
vi.mock('./schema', () => ({ schemaForVersion: () => ({}) }))

function makeCtx(read = '[A]\r\nx=1\r\n') {
  const write = vi.fn(async () => ({ backupPath: null }))
  return {
    ctx: {
      getPoeVersion: () => 2,
      gameConfig: { read: vi.fn(async () => ({ content: read, path: 'p' })), write, onChange: () => () => {} },
    } as any,
    write,
  }
}

describe('App', () => {
  it('loads, edits, enables Save, and writes serialized output', async () => {
    const { ctx, write } = makeCtx()
    render(<App ctx={ctx} />)
    const input = await screen.findByLabelText('val')
    expect((screen.getByText('Save') as HTMLButtonElement).disabled).toBe(true)
    fireEvent.change(input, { target: { value: '9' } })
    fireEvent.click(screen.getByText('Save *'))
    await waitFor(() => expect(write).toHaveBeenCalledWith('[A]\r\nx=9\r\n'))
  })

  it('shows an error banner when read fails', async () => {
    const ctx = {
      getPoeVersion: () => 2,
      gameConfig: {
        read: vi.fn(async () => {
          throw new Error('config file not found')
        }),
        write: vi.fn(),
        onChange: () => () => {},
      },
    } as any
    render(<App ctx={ctx} />)
    expect(await screen.findByText(/err:config file not found/)).toBeTruthy()
  })
})
