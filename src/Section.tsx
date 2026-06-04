import { Down, Up } from '@icon-park/react'
import { type ReactNode, useState } from 'react'

export function Section({
  title,
  forceOpen = false,
  children,
}: {
  title: string
  forceOpen?: boolean
  children: ReactNode
}): JSX.Element {
  const [open, setOpen] = useState(false)
  const isOpen = forceOpen || open
  return (
    <section style={{ background: 'var(--bg-card)', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!forceOpen) setOpen((o) => !o)
        }}
        onKeyDown={(e) => {
          if (!forceOpen && (e.key === 'Enter' || e.key === ' ')) setOpen((o) => !o)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        <span style={{ display: 'flex', color: 'var(--text-dim)' }}>{isOpen ? <Up size={14} /> : <Down size={14} />}</span>
      </div>
      {isOpen && <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 12px 12px' }}>{children}</div>}
    </section>
  )
}
