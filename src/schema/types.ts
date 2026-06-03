export type ControlKind = 'toggle' | 'text' | 'number' | 'slider' | 'enum' | 'key' | 'raw'

export interface KeySchema {
  type?: ControlKind            // override the heuristic
  label?: string                // friendly label
  options?: string[]            // for enum
  min?: number
  max?: number
  step?: number
  decimals?: number             // for slider/number
}

export interface SectionSchema {
  title?: string                // friendly section title
  keys?: Record<string, KeySchema>
}

export type GameSchema = Record<string, SectionSchema> // keyed by raw [SECTION]
