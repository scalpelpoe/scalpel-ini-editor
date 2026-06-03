import { SettingTwo } from '@icon-park/react'
import type { ScalpelPluginContext } from '@scalpelpoe/plugin-sdk'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { App } from './App'

export default function activate(ctx: ScalpelPluginContext): void {
  ctx.registerTab({
    label: '.ini Editor',
    icon: renderToStaticMarkup(<SettingTwo theme="two-tone" fill={['currentColor', 'rgba(255,255,255,0.2)']} />),
    render: (container) => {
      const root = createRoot(container)
      root.render(<App ctx={ctx} />)
      return () => root.unmount()
    },
  })
}
