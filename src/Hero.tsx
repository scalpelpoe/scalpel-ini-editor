import { Button } from '@scalpelpoe/plugin-sdk'
import type { ReactNode } from 'react'

export function Hero({
  title,
  subtitle,
  save,
  onReload,
}: {
  title: string
  subtitle: string
  save: ReactNode
  onReload: () => void
}): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 10,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 12px',
        margin: '-8px -8px 0',
      }}
    >
      <div>
        <div className="section-title">{title}</div>
        <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Button variant="ghost" size="sm" onClick={onReload}>
          Reload
        </Button>
        {save}
      </div>
    </div>
  )
}
