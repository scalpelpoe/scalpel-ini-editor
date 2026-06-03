import { Down, Right } from '@icon-park/react'
import { type ReactNode, useState } from 'react'

export function Section({
  rawName,
  title,
  count,
  defaultOpen = false,
  children,
}: {
  rawName: string
  title: string
  count: number
  defaultOpen?: boolean
  children: ReactNode
}): JSX.Element {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--border, rgba(255,255,255,0.1))' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 4px', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}
      >
        {open ? <Down /> : <Right />}
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ opacity: 0.5, fontSize: 12 }}>[{rawName}]</span>
        <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: 12 }}>{count}</span>
      </button>
      {open && <div style={{ padding: '4px 8px 12px' }}>{children}</div>}
    </div>
  )
}
