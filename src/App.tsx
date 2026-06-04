import { Caution } from '@icon-park/react'
import { ErrorBanner, Notice, TextInput } from '@scalpelpoe/plugin-sdk'
import type { ScalpelPluginContext } from '@scalpelpoe/plugin-sdk'
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { classify } from './classify'
import { SettingField } from './controls/SettingField'
import { Hero } from './Hero'
import { type IniDoc, parseIni, serializeIni, setValueAt } from './ini-model'
import { SaveButton } from './SaveButton'
import { schemaForVersion } from './schema'
import { ScrollToastHeader } from './ScrollToastHeader'
import { Section } from './Section'
import { Toast } from './Toast'

export function App({ ctx }: { ctx: ScalpelPluginContext }): JSX.Element {
  const schema = useMemo(() => schemaForVersion(ctx.getPoeVersion()), [ctx])
  const [doc, setDoc] = useState<IniDoc | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [externalChange, setExternalChange] = useState(false)
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty
  const savingRef = useRef(false)
  // Our own write trips the host file-watcher; ignore onChange for a window
  // after a save so we never reload or warn about our own write.
  const suppressUntil = useRef(0)
  // Drop stale reads when several load()s overlap (watcher + manual Reload).
  const loadGen = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function load(): Promise<void> {
    const gen = ++loadGen.current
    try {
      const { content } = await ctx.gameConfig.read()
      if (gen !== loadGen.current) return
      setDoc(parseIni(content))
      setDirty(false)
      setExternalChange(false)
      setError(null)
    } catch (e) {
      if (gen === loadGen.current) setError((e as Error).message)
    }
  }

  useEffect(() => {
    void load()
    const off = ctx.gameConfig.onChange(() => {
      if (savingRef.current || Date.now() < suppressUntil.current) return
      if (dirtyRef.current) setExternalChange(true)
      else void load()
    })
    return () => {
      off()
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
    // load is stable for a given ctx; re-subscribe only when ctx changes
  }, [ctx])

  async function save(): Promise<void> {
    if (!doc || savingRef.current) return
    savingRef.current = true
    setSaving(true)
    try {
      await ctx.gameConfig.write(serializeIni(doc))
      suppressUntil.current = Date.now() + 1500
      setDirty(false)
      setExternalChange(false)
      setToast(true)
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(false), 3500)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  const sections = useMemo(() => {
    type Group = { name: string; pairs: { key: string; value: string; index: number }[] }
    const out: Group[] = []
    if (!doc) return out
    let current: Group | null = null
    doc.lines.forEach((l, index) => {
      if (l.kind === 'section') {
        current = { name: l.name, pairs: [] }
        out.push(current)
      } else if (l.kind === 'pair') {
        current?.pairs.push({ key: l.key, value: l.value, index })
      }
    })
    return out
  }, [doc])

  if (error) return <ErrorBanner message={error} tone="error" />
  if (!doc) return <div style={{ padding: 12 }}>Loading config...</div>

  const q = query.trim().toLowerCase()
  const onEdit = (index: number, v: string): void => {
    setDoc((d) => (d ? setValueAt(d, index, v) : d))
    setDirty(true)
  }

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <ScrollToastHeader collapsed={collapsed}>
        <SaveButton dirty={dirty} saving={saving} onSave={() => void save()} compact />
      </ScrollToastHeader>
      <Toast
        visible={toast}
        message={`.ini saved, restart PoE${ctx.getPoeVersion()} for these changes to take effect. Probably.`}
      />
      <div
        ref={scrollRef}
        onScroll={() => {
          if (scrollRef.current) setCollapsed(scrollRef.current.scrollTop > 60)
        }}
        style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 8 }}
      >
        <Hero
          title=".ini Editor"
          subtitle="If you don't know what you're doing, be careful. This plugin edits your production_Config.ini file directly, and will be loaded again after you restart the game."
          save={<SaveButton dirty={dirty} saving={saving} onSave={() => void save()} fullHeight />}
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
          const sectionTitle = schema[s.name]?.title ?? s.name
          const titleMatch = q.length > 0 && sectionTitle.toLowerCase().includes(q)
          const rows = s.pairs.map((p) => ({ p, control: classify(s.name, p.key, p.value, schema) }))
          const visible =
            !q || titleMatch
              ? rows
              : rows.filter(
                  ({ p, control }) => p.key.toLowerCase().includes(q) || control.label.toLowerCase().includes(q),
                )
          if (q && visible.length === 0) return null
          return (
            <Section key={s.name} title={sectionTitle} forceOpen={Boolean(q)}>
              {visible.map(({ p, control }) => (
                <SettingField key={p.index} control={control} value={p.value} onChange={(v) => onEdit(p.index, v)} />
              ))}
            </Section>
          )
        })}
      </div>
    </div>
  )
}
