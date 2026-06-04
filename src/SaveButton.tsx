import type { CSSProperties } from 'react'

export function SaveButton({
  dirty,
  saving,
  onSave,
  compact = false,
  fullHeight = false,
}: {
  dirty: boolean
  saving: boolean
  onSave: () => void
  compact?: boolean
  fullHeight?: boolean
}): JSX.Element {
  const active = dirty || saving
  const base: CSSProperties = {
    border: 'none',
    borderRadius: 4,
    fontWeight: 600,
    padding: compact ? '6px 16px' : '8px 24px',
    fontSize: compact ? 11 : 13,
    // Fixed width so the label changing to "Saving..." never shifts the layout.
    minWidth: compact ? 80 : 108,
    height: fullHeight ? '100%' : undefined,
    cursor: dirty ? 'pointer' : 'default',
    ...(active
      ? { background: 'var(--accent)', color: '#171821' }
      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.15)' }),
  }
  return (
    <button type="button" style={base} disabled={!dirty || saving} onClick={onSave}>
      {saving ? 'Saving...' : 'Save'}
    </button>
  )
}
