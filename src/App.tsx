import { Caution } from '@icon-park/react'
import { ErrorBanner, Notice, TextInput } from '@scalpelpoe/plugin-sdk'
import type { ScalpelPluginContext } from '@scalpelpoe/plugin-sdk'
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { classify } from './classify'
import { SettingField } from './controls/SettingField'
import { Hero } from './Hero'
import { type IniDoc, parseIni, serializeIni, setValue } from './ini-model'
import { SaveButton } from './SaveButton'
import { schemaForVersion } from './schema'
import { ScrollToastHeader } from './ScrollToastHeader'
import { Section } from './Section'

export function App({ ctx }: { ctx: ScalpelPluginContext }): JSX.Element {
  const schema = useMemo(() => schemaForVersion(ctx.getPoeVersion()), [ctx])
  const [doc, setDoc] = useState<IniDoc | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [externalChange, setExternalChange] = useState(false)
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty
  const savingRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function load(): Promise<void> {
    try {
      const { content } = await ctx.gameConfig.read()
      setDoc(parseIni(content))
      setDirty(false)
      setSaved(false)
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
    return () => {
      off()
      if (savedTimer.current) clearTimeout(savedTimer.current)
    }
    // load is stable for a given ctx; re-subscribe only when ctx changes
  }, [ctx])

  async function save(): Promise<void> {
    if (!doc || savingRef.current) return
    savingRef.current = true
    setSaving(true)
    try {
      await ctx.gameConfig.write(serializeIni(doc))
      setDirty(false)
      setExternalChange(false)
      setSaved(true)
      if (savedTimer.current) clearTimeout(savedTimer.current)
      savedTimer.current = setTimeout(() => setSaved(false), 1500)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  const sections = useMemo(() => {
    const out: { name: string; pairs: { key: string; value: string }[] }[] = []
    if (!doc) return out
    for (const l of doc.lines) {
      if (l.kind === 'section') out.push({ name: l.name, pairs: [] })
      else if (l.kind === 'pair') {
        const s = out.find((x) => x.name === l.section) ?? out[out.length - 1]
        s?.pairs.push({ key: l.key, value: l.value })
      }
    }
    return out
  }, [doc])

  if (error) return <ErrorBanner message={error} tone="error" />
  if (!doc) return <div style={{ padding: 12 }}>Loading config...</div>

  const q = query.trim().toLowerCase()
  const onEdit = (section: string, key: string, v: string): void => {
    setDoc((d) => (d ? setValue(d, section, key, v) : d))
    setDirty(true)
    setSaved(false)
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScrollToastHeader collapsed={collapsed}>
        <SaveButton dirty={dirty} saving={saving} saved={saved} onSave={() => void save()} compact />
      </ScrollToastHeader>
      <div
        ref={scrollRef}
        onScroll={() => {
          if (scrollRef.current) setCollapsed(scrollRef.current.scrollTop > 60)
        }}
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 8 }}
      >
        <Hero
          title=".ini Editor"
          subtitle="Edits apply next launch. Avoid changing these in PoE's own Options this session."
          save={<SaveButton dirty={dirty} saving={saving} saved={saved} onSave={() => void save()} fullHeight />}
        />
        {externalChange && (
          <div style={{ marginTop: 8 }}>
            <Notice
              icon={<Caution />}
              title="File changed on disk"
              body="The config was rewritten outside Scalpel. Reload to avoid overwriting it with your unsaved edits."
              action={{ label: 'Reload', onClick: () => void load() }}
            />
          </div>
        )}
        <div style={{ margin: '8px 0' }}>
          <TextInput
            placeholder="Search settings..."
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            fullWidth
          />
        </div>
        {sections.map((s) => {
          const visible = s.pairs.filter((p) => !q || p.key.toLowerCase().includes(q))
          if (q && visible.length === 0) return null
          const title = schema[s.name]?.title ?? s.name
          return (
            <Section key={s.name} title={title} forceOpen={Boolean(q)}>
              {visible.map((p) => (
                <SettingField
                  key={p.key}
                  control={classify(s.name, p.key, p.value, schema)}
                  value={p.value}
                  onChange={(v) => onEdit(s.name, p.key, v)}
                />
              ))}
            </Section>
          )
        })}
      </div>
    </div>
  )
}
