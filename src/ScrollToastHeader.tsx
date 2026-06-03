import type { ReactNode } from 'react'

export function ScrollToastHeader({ collapsed, children }: { collapsed: boolean; children: ReactNode }): JSX.Element {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        padding: '6px 12px',
        background: 'var(--bg-solid)',
        borderBottom: '1px solid var(--border)',
        transition: 'transform .2s ease-out, opacity .2s ease-out',
        transform: collapsed ? 'translateY(0)' : 'translateY(-100%)',
        opacity: collapsed ? 1 : 0,
        pointerEvents: collapsed ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  )
}
