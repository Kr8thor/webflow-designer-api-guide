import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: 'iife',
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
})
