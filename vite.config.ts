import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: () => 'plugin.js',
    },
    rollupOptions: {
      // Scalpel provides these at runtime via importmap.
      external: ['react', 'react-dom', 'react-dom/client', 'react-dom/server', 'react/jsx-runtime', '@scalpelpoe/plugin-sdk'],
    },
    minify: 'esbuild',
    sourcemap: true,
  },
})
