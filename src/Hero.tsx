import type { ReactNode } from 'react'

export function Hero({ title, subtitle, save }: { title: string; subtitle: string; save: ReactNode }): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        gap: 10,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 12px',
        margin: '-8px -8px 0',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="section-title">{title}</div>
        <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>{save}</div>
    </div>
  )
}
