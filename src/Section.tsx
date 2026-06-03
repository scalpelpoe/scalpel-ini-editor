import { Down, Right } from '@icon-park/react'
import { type ReactNode, useState } from 'react'

export function Section({
  title,
  defaultOpen = false,
  forceOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  forceOpen?: boolean
  children: ReactNode
}): JSX.Element {
  const [open, setOpen] = useState(defaultOpen)
  const isOpen = forceOpen || open
  return (
    <section>
      <div
        className="setting-box mt-[2px]"
        role="button"
        tabIndex={0}
        onClick={() => {
          if (!forceOpen) setOpen((o) => !o)
        }}
        onKeyDown={(e) => {
          if (!forceOpen && (e.key === 'Enter' || e.key === ' ')) setOpen((o) => !o)
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        <span style={{ display: 'flex' }}>{isOpen ? <Down size={14} /> : <Right size={14} />}</span>
      </div>
      {isOpen && <div style={{ margin: '4px 0 10px' }}>{children}</div>}
    </section>
  )
}
