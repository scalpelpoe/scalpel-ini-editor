import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseIni, serializeIni, setValue, setValueAt } from './ini-model'

describe('ini-model', () => {
  it('round-trips a simple file byte-for-byte with no edits', () => {
    const text = '[A]\r\nx=1\r\ny=hello world\r\n\r\n[B]\r\nz=true\r\n'
    expect(serializeIni(parseIni(text))).toBe(text)
  })

  it('round-trips the real PoE2 fixture unchanged (BOM + CRLF preserved)', () => {
    const text = readFileSync(join(__dirname, '../__fixtures__/poe2.ini'), 'utf8')
    expect(serializeIni(parseIni(text))).toBe(text)
  })

  it('round-trips the real PoE1 fixture unchanged (BOM + CRLF preserved)', () => {
    const text = readFileSync(join(__dirname, '../__fixtures__/poe1.ini'), 'utf8')
    expect(serializeIni(parseIni(text))).toBe(text)
  })

  it('changes exactly one value, preserving everything else', () => {
    const text = '[A]\r\nx=1\r\ny=2\r\n'
    const doc = setValue(parseIni(text), 'A', 'x', '9')
    expect(serializeIni(doc)).toBe('[A]\r\nx=9\r\ny=2\r\n')
  })

  it('scopes keys by section (duplicate names across sections are distinct)', () => {
    const text = '[ACTION_KEYS]\r\nmove_up=0\r\n[WASD_ACTION_KEYS]\r\nmove_up=87\r\n'
    const doc = setValue(parseIni(text), 'WASD_ACTION_KEYS', 'move_up', '38')
    expect(serializeIni(doc)).toBe('[ACTION_KEYS]\r\nmove_up=0\r\n[WASD_ACTION_KEYS]\r\nmove_up=38\r\n')
  })

  it('leaves a value containing = intact (splits on the first = only)', () => {
    const text = '[A]\r\nk=a=b=c\r\n'
    expect(serializeIni(parseIni(text))).toBe(text)
  })

  it('setValueAt edits only the pair at the given line index', () => {
    const doc = parseIni('[A]\r\nx=1\r\nx=2\r\n')
    // line 0 = [A], line 1 = first x, line 2 = second x
    expect(serializeIni(setValueAt(doc, 2, '9'))).toBe('[A]\r\nx=1\r\nx=9\r\n')
  })
})
