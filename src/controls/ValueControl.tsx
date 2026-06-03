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
    case 'slider':
      return (
        <Slider
          min={control.min ?? 0}
          max={control.max ?? 1}
          step={control.step ?? 0.05}
          value={Number(value) || 0}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          fullWidth
        />
      )
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
