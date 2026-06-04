import type { ScalpelPluginContext } from '@scalpelpoe/plugin-sdk'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// "INI" wordmark (two bars + a center arch). Uses currentColor so it inherits
// the title-bar text color; the host clamps it to 16x16.
const TAB_ICON =
  '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="9" width="7" height="30" fill="currentColor"/><path d="M19 39 V21 C19 11 29 11 29 21 V39" stroke="currentColor" stroke-width="6.5" fill="none"/><rect x="33" y="9" width="7" height="30" fill="currentColor"/></svg>'

export default function activate(ctx: ScalpelPluginContext): void {
  ctx.registerTab({
    label: '.ini Editor',
    icon: TAB_ICON,
    render: (container) => {
      const root = createRoot(container)
      root.render(<App ctx={ctx} />)
      return () => root.unmount()
    },
  })
}
