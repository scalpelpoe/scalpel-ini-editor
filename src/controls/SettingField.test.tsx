import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingField } from './SettingField'

vi.mock('@scalpelpoe/plugin-sdk', () => ({
  SettingToggleBox: ({ label }: any) => <div data-testid="toggle-box">{label}</div>,
  SettingSelectBox: ({ label, options }: any) => (
    <div data-testid="select-box" data-options={options.map((o: any) => o.value).join(',')}>
      {label}
    </div>
  ),
}))
vi.mock('./ValueControl', () => ({ ValueControl: ({ control }: any) => <div data-testid={`vc-${control.kind}`} /> }))

describe('SettingField', () => {
  it('toggle -> SettingToggleBox', () => {
    render(<SettingField control={{ kind: 'toggle', label: 'Flag' }} value="true" onChange={() => {}} />)
    expect(screen.getByTestId('toggle-box').textContent).toBe('Flag')
  })
  it('enum -> SettingSelectBox', () => {
    render(<SettingField control={{ kind: 'enum', label: 'VSync', options: ['On', 'Off'] }} value="Off" onChange={() => {}} />)
    expect(screen.getByTestId('select-box')).toBeTruthy()
  })
  it('enum injects the current value when it is not in the curated options', () => {
    render(<SettingField control={{ kind: 'enum', label: 'Shadows', options: ['Off', 'High'] }} value="Legacy" onChange={() => {}} />)
    expect(screen.getByTestId('select-box').getAttribute('data-options')).toBe('Legacy,Off,High')
  })
  it('number -> label + ValueControl in a setting-box', () => {
    const { container } = render(<SettingField control={{ kind: 'number', label: 'Width' }} value="1920" onChange={() => {}} />)
    expect(container.querySelector('label')?.textContent).toBe('Width')
    expect(container.querySelector('.setting-box')).toBeTruthy()
    expect(screen.getByTestId('vc-number')).toBeTruthy()
  })
  it('raw -> label + ValueControl, no setting-box', () => {
    const { container } = render(<SettingField control={{ kind: 'raw', label: 'Builds' }} value="{}" onChange={() => {}} />)
    expect(container.querySelector('label')?.textContent).toBe('Builds')
    expect(container.querySelector('.setting-box')).toBeNull()
    expect(screen.getByTestId('vc-raw')).toBeTruthy()
  })
  it('key -> label + ValueControl in a setting-box', () => {
    const { container } = render(<SettingField control={{ kind: 'key', label: 'Pickup' }} value="0" onChange={() => {}} />)
    expect(container.querySelector('label')?.textContent).toBe('Pickup')
    expect(container.querySelector('.setting-box')).toBeTruthy()
    expect(screen.getByTestId('vc-key')).toBeTruthy()
  })
})
