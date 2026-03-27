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
      // Organizations / SAM data API (FastAPI registers routes under /api/v1)
      // The frontend requests /sam-data/... so rewrite to include the /api/v1 prefix
      '/sam-data': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/sam-data/, '/api/v1/sam-data'),
      },
      // Dynamic table-header metadata endpoint — also lives under /api/v1
      '/table-headers': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/table-headers/, '/api/v1/table-headers'),
      },
    },
  },
})
