export type IniLine =
  | { kind: 'section'; name: string; raw: string }
  | { kind: 'pair'; section: string; key: string; value: string; eol: string }
  | { kind: 'passthrough'; raw: string }

export interface IniDoc {
  lines: IniLine[]
}

const SECTION_RE = /^\[(.+)\]$/
const PAIR_RE = /^([^=]+)=(.*)$/

/** Split into lines while remembering each line's exact ending (no normalization). */
function splitKeepEol(text: string): { body: string; eol: string }[] {
  const out: { body: string; eol: string }[] = []
  const re = /([^\r\n]*)(\r\n|\n|\r|$)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m[0] === '' && m.index === text.length) break
    out.push({ body: m[1], eol: m[2] })
    if (m[2] === '') break
  }
  return out
}

export function parseIni(text: string): IniDoc {
  const lines: IniLine[] = []
  let section = ''
  for (const { body, eol } of splitKeepEol(text)) {
    const trimmed = body.trim()
    const sec = SECTION_RE.exec(trimmed)
    if (sec) {
      section = sec[1]
      lines.push({ kind: 'section', name: section, raw: body + eol })
      continue
    }
    const trimmedStart = body.trimStart()
    const pair = PAIR_RE.exec(body)
    if (pair && !trimmedStart.startsWith(';') && !trimmedStart.startsWith('#')) {
      lines.push({ kind: 'pair', section, key: pair[1], value: pair[2], eol })
      continue
    }
    lines.push({ kind: 'passthrough', raw: body + eol })
  }
  return { lines }
}

export function serializeIni(doc: IniDoc): string {
  return doc.lines.map((l) => (l.kind === 'pair' ? `${l.key}=${l.value}${l.eol}` : l.raw)).join('')
}

export function setValue(doc: IniDoc, section: string, key: string, value: string): IniDoc {
  return {
    lines: doc.lines.map((l) =>
      l.kind === 'pair' && l.section === section && l.key === key ? { ...l, value } : l,
    ),
  }
}

/** Replace the value of the pair at a specific line index. Targets exactly one
 *  line, so duplicate keys within a section never collide. */
export function setValueAt(doc: IniDoc, index: number, value: string): IniDoc {
  return {
    lines: doc.lines.map((l, i) => (i === index && l.kind === 'pair' ? { ...l, value } : l)),
  }
}
