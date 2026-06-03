import { describe, expect, it } from 'vitest'
import { labelForVk, replaceFirstToken, vkLabel } from './vk-codes'

describe('vk-codes', () => {
  it('labels common keys', () => {
    expect(vkLabel(87)).toBe('W')
    expect(vkLabel(49)).toBe('1')
    expect(vkLabel(32)).toBe('Space')
    expect(vkLabel(13)).toBe('Enter')
    expect(vkLabel(119)).toBe('F8')
  })

  it('falls back to the raw code for unknown VKs', () => {
    expect(vkLabel(255)).toBe('VK 255')
  })

  it('labels a full raw value, keeping trailing tokens', () => {
    expect(labelForVk('81 2')).toBe('Q (slot 2)')
    expect(labelForVk('0')).toBe('Unbound')
  })

  it('replaces only the first token', () => {
    expect(replaceFirstToken('81 2', '87')).toBe('87 2')
    expect(replaceFirstToken('81', '87')).toBe('87')
  })
})
