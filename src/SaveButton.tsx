import type { CSSProperties } from 'react'

export function SaveButton({
  dirty,
  saving,
  saved,
  onSave,
  compact = false,
  fullHeight = false,
}: {
  dirty: boolean
  saving: boolean
  saved: boolean
  onSave: () => void
  compact?: boolean
  fullHeight?: boolean
}): JSX.Element {
  const label = saving ? 'Saving...' : saved ? 'Saved' : 'Save'
  const base: CSSProperties = {
    border: 'none',
    borderRadius: 4,
    fontWeight: 600,
    padding: compact ? '6px 16px' : '8px 24px',
    fontSize: compact ? 11 : 13,
    height: fullHeight ? '100%' : undefined,
    cursor: dirty ? 'pointer' : 'default',
  }
  const tone: CSSProperties = saved
    ? { background: 'var(--match)', color: '#fff' }
    : dirty
      ? { background: 'var(--accent)', color: '#171821' }
      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.15)' }
  return (
    <button type="button" style={{ ...base, ...tone }} disabled={!dirty || saving} onClick={onSave}>
      {label}
    </button>
  )
}
