import { SettingSelectBox, SettingToggleBox } from '@scalpelpoe/plugin-sdk'
import type { Control } from '../classify'
import { ValueControl } from './ValueControl'

export function SettingField({
  control,
  value,
  onChange,
}: {
  control: Control
  value: string
  onChange: (v: string) => void
}): JSX.Element {
  if (control.kind === 'toggle') {
    return <SettingToggleBox label={control.label} checked={value.trim() === 'true'} onChange={(b) => onChange(String(b))} />
  }
  if (control.kind === 'enum') {
    const opts = control.options ?? []
    const withCurrent = opts.includes(value) ? opts : [value, ...opts]
    return (
      <SettingSelectBox
        label={control.label}
        value={value}
        options={withCurrent.map((o) => ({ label: o, value: o }))}
        onChange={onChange}
      />
    )
  }
  if (control.kind === 'raw') {
    return (
      <section>
        <label>{control.label}</label>
        <div style={{ marginTop: 2 }}>
          <ValueControl control={control} value={value} onChange={onChange} />
        </div>
      </section>
    )
  }
  if (control.kind === 'slider') {
    return (
      <section>
        <label>{control.label}</label>
        <div className="setting-box mt-[2px]">
          <span className="value">{value}</span>
          <div style={{ flex: 1, marginLeft: 8 }}>
            <ValueControl control={control} value={value} onChange={onChange} />
          </div>
        </div>
      </section>
    )
  }
  return (
    <section>
      <label>{control.label}</label>
      <div className="setting-box mt-[2px]">
        <ValueControl control={control} value={value} onChange={onChange} />
      </div>
    </section>
  )
}
