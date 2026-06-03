import { Button } from '@scalpelpoe/plugin-sdk'
import { type KeyboardEvent, useState } from 'react'
import { labelForVk, replaceFirstToken } from '../vk-codes'

export function KeyField({ value, onChange }: { value: string; onChange: (v: string) => void }): JSX.Element {
  const [arming, setArming] = useState(false)
  return (
    <Button
      variant={arming ? 'primary' : 'secondary'}
      size="sm"
      onClick={() => setArming(true)}
      onBlur={() => setArming(false)}
      onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
        if (!arming) return
        e.preventDefault()
        // e.keyCode is deprecated but is the only API that yields raw Windows VK
        // codes, which is exactly what PoE stores. Intentionally kept.
        onChange(replaceFirstToken(value, String(e.keyCode)))
        setArming(false)
      }}
    >
      {arming ? 'Press a key...' : labelForVk(value)}
    </Button>
  )
}
