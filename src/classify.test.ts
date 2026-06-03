import { describe, expect, it } from 'vitest'
import { classify } from './classify'
import type { GameSchema } from './schema/types'

const schema: GameSchema = {
  DISPLAY: { keys: { vsync: { type: 'enum', options: ['On', 'Off'] } } },
  UI: { keys: { key_pickup: { type: 'key' }, minimap_geometry_alpha: { type: 'slider', min: 0, max: 1 } } },
  ACTION_KEYS: {},
}

describe('classify', () => {
  it('uses schema enum with options', () => {
    expect(classify('DISPLAY', 'vsync', 'Off', schema)).toMatchObject({ kind: 'enum', options: ['On', 'Off'] })
  })
  it('treats *ACTION_KEYS members as keys via heuristic', () => {
    expect(classify('ACTION_KEYS', 'move_up', '87', schema).kind).toBe('key')
  })
  it('treats a schema-marked out-of-section key as a key', () => {
    expect(classify('UI', 'key_pickup', '0', schema).kind).toBe('key')
  })
  it('does NOT treat a plain number as a key', () => {
    expect(classify('UI', 'join_global_channel', '4340', schema).kind).toBe('number')
  })
  it('booleans -> toggle', () => {
    expect(classify('X', 'flag', 'true', schema).kind).toBe('toggle')
    expect(classify('X', 'flag', 'false', schema).kind).toBe('toggle')
  })
  it('0..1 decimal -> slider', () => {
    expect(classify('UI', 'minimap_geometry_alpha', '0.55', schema).kind).toBe('slider')
  })
  it('integer -> number', () => {
    expect(classify('X', 'n', '1836', schema).kind).toBe('number')
  })
  it('JSON-ish blob -> raw', () => {
    expect(classify('UI', 'active_builds', '{"a":1}', schema).kind).toBe('raw')
  })
  it('empty / other string -> text', () => {
    expect(classify('LOGIN', 'account_name', '', schema).kind).toBe('text')
  })
})
