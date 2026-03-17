import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/rashtriya-e-pustakalaya-dictionary/',
  plugins: [react()],
  resolve: {
    alias: {
      // Use tooltip-agent source so we don't need to build the package first
      'tooltip-agent': path.resolve(__dirname, 'packages/tooltip-agent/src/index.js'),
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist'],
  },
})
