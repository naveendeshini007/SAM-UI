import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Auth + user management API (FastAPI at :8000)
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Organizations / SAM data API (FastAPI at :8000)
      '/sam-data': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Dynamic table-header metadata endpoint
      '/table-headers': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
