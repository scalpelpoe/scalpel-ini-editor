import { ScrubInput, SettingSelectBox, Slider, Textarea, TextInput, Toggle } from '@scalpelpoe/plugin-sdk'
import type { ChangeEvent } from 'react'
import type { Control } from '../classify'
import { KeyField } from './KeyField'

export function ValueControl({
  control,
  value,
  onChange,
}: {
  control: Control
  value: string
  onChange: (v: string) => void
}): JSX.Element {
  switch (control.kind) {
    case 'toggle':
      return <Toggle checked={value.trim() === 'true'} onChange={(c) => onChange(String(c))} />
    case 'key':
      return <KeyField value={value} onChange={onChange} />
    case 'enum':
      return (
        <SettingSelectBox
          label={control.label}
          value={value}
          options={(control.options ?? [value]).map((o) => ({ label: o, value: o }))}
          onChange={onChange}
        />
      )
    case 'slider': {
      const n = Number(value)
      const min = control.min ?? 0
      const max = control.max ?? 1
      // Out-of-range or non-numeric stored values (e.g. GGG's dialogue_sound_volume2=330)
      // would be silently clamped by a range input, so edit them with the scrubber instead.
      if (!Number.isFinite(n) || n < min || n > max) {
        return (
          <ScrubInput
            value={value === '' ? null : n}
            decimals={control.decimals ?? 0}
            onChange={(v) => onChange(v === null ? '' : String(v))}
          />
        )
      }
      return (
        <Slider
          min={min}
          max={max}
          step={control.step ?? 0.05}
          value={n}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          fullWidth
        />
      )
    }
    case 'number':
      return (
        <ScrubInput
          value={value === '' ? null : Number(value)}
          decimals={control.decimals ?? 0}
          onChange={(n) => onChange(n === null ? '' : String(n))}
        />
      )
    case 'raw':
      return <Textarea value={value} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} fullWidth rows={3} />
    default:
      return <TextInput value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} fullWidth />
  }
}
