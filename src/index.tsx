import type { ScalpelPluginContext } from '@scalpelpoe/plugin-sdk'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// "INI" wordmark (two bars + a center arch) from the plugin icon, in currentColor
// so it inherits the title-bar text color. The host clamps it to 16x16.
const TAB_ICON =
  '<svg viewBox="46 -21 160 160" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M64.4746 6V118.281" stroke="currentColor" stroke-width="22.2444"/><path d="M189.467 6V118.281" stroke="currentColor" stroke-width="22.2444"/><path d="M99.4297 118.281C99.4297 118.281 99.4297 118.282 99.4297 59.5685C99.4297 0.854789 153.452 0.854756 153.452 59.5685C153.452 118.282 153.452 118.281 153.452 118.281" stroke="currentColor" stroke-width="22.2444"/></svg>'

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
