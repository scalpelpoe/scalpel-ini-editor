import { Caution, Info } from '@icon-park/react'
import { Button, ErrorBanner, Notice, TextInput } from '@scalpelpoe/plugin-sdk'
import type { ScalpelPluginContext } from '@scalpelpoe/plugin-sdk'
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { classify } from './classify'
import { ValueControl } from './controls/ValueControl'
import { type IniDoc, parseIni, serializeIni, setValue } from './ini-model'
import { schemaForVersion } from './schema'
import { Section } from './Section'

export function App({ ctx }: { ctx: ScalpelPluginContext }): JSX.Element {
  const schema = useMemo(() => schemaForVersion(ctx.getPoeVersion()), [ctx])
  const [doc, setDoc] = useState<IniDoc | null>(null)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [externalChange, setExternalChange] = useState(false)
  const [query, setQuery] = useState('')
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty
  const savingRef = useRef(false)

  async function load(): Promise<void> {
    try {
      const { content } = await ctx.gameConfig.read()
      setDoc(parseIni(content))
      setDirty(false)
      setExternalChange(false)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  useEffect(() => {
    void load()
    const off = ctx.gameConfig.onChange(() => {
      if (savingRef.current) return
      if (dirtyRef.current) setExternalChange(true)
      else void load()
    })
    return off
    // load is stable for a given ctx; re-subscribe only when ctx changes
  }, [ctx])

  async function save(): Promise<void> {
    if (!doc) return
    savingRef.current = true
    try {
      await ctx.gameConfig.write(serializeIni(doc))
      setDirty(false)
      setExternalChange(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      savingRef.current = false
    }
  }

  const sections = useMemo(() => {
    const out: { name: string; pairs: { key: string; value: string }[] }[] = []
    if (!doc) return out
    for (const l of doc.lines) {
      if (l.kind === 'section') out.push({ name: l.name, pairs: [] })
      else if (l.kind === 'pair') {
        // parseIni already set l.section to a header that was pushed; the
        // fallback only matters for pairs before the first [SECTION], which
        // real PoE configs never contain.
        const s = out.find((x) => x.name === l.section) ?? out[out.length - 1]
        s?.pairs.push({ key: l.key, value: l.value })
      }
    }
    return out
  }, [doc])

  if (error) return <ErrorBanner message={error} tone="error" />
  if (!doc) return <div style={{ padding: 12 }}>Loading config...</div>

  const q = query.trim().toLowerCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
      <Notice
        icon={<Info />}
        title="Editing the game config"
        body="Changes apply the next time you launch the game. Heads up: if you also change these same settings in Path of Exile's own Options menu this session, the game will overwrite your edits when it saves its config."
      />
      {externalChange && (
        <Notice
          icon={<Caution />}
          title="File changed on disk"
          body="The config was rewritten outside Scalpel. Reload to avoid overwriting it with your unsaved edits."
          action={{ label: 'Reload', onClick: () => void load() }}
        />
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <TextInput placeholder="Search settings..." value={query} onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} fullWidth />
        <Button variant="secondary" size="sm" onClick={() => void load()}>
          Reload
        </Button>
        <Button variant="primary" size="sm" disabled={!dirty} onClick={() => void save()}>
          {dirty ? 'Save *' : 'Save'}
        </Button>
      </div>
      {sections.map((s) => {
        const visible = s.pairs.filter((p) => !q || p.key.toLowerCase().includes(q))
        if (q && visible.length === 0) return null
        const title = schema[s.name]?.title ?? s.name
        return (
          <Section key={s.name} rawName={s.name} title={title} count={visible.length} defaultOpen={Boolean(q)}>
            {visible.map((p) => {
              const control = classify(s.name, p.key, p.value, schema)
              return (
                <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
                  <span style={{ flex: 1, fontSize: 13 }}>{control.label}</span>
                  <div style={{ flex: 1 }}>
                    <ValueControl
                      control={control}
                      value={p.value}
                      onChange={(v) => {
                        setDoc((d) => (d ? setValue(d, s.name, p.key, v) : d))
                        setDirty(true)
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </Section>
        )
      })}
    </div>
  )
}
