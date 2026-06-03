import type { ControlKind, GameSchema, KeySchema } from './schema/types'

export interface Control extends KeySchema {
  kind: ControlKind
  label: string
}

const INT_RE = /^-?\d+$/
const DEC_RE = /^-?\d*\.\d+$/

export function classify(section: string, key: string, value: string, schema: GameSchema): Control {
  const entry = schema[section]?.keys?.[key]
  const label = entry?.label ?? key
  if (entry?.type) return { ...entry, kind: entry.type, label }

  if (/ACTION_KEYS$/.test(section)) return { kind: 'key', label }
  const v = value.trim()
  if (v === 'true' || v === 'false') return { kind: 'toggle', label }
  if (v.startsWith('{')) return { kind: 'raw', label }
  if (DEC_RE.test(v)) {
    const n = Number(v)
    if (n >= 0 && n <= 1) return { kind: 'slider', label, min: 0, max: 1, step: 0.05, decimals: 2, ...entry }
    return { kind: 'number', label, decimals: 2, ...entry }
  }
  if (INT_RE.test(v)) return { kind: 'number', label, ...entry }
  return { kind: 'text', label }
}
