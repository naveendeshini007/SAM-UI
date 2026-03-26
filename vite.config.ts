import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All requests starting with /api are forwarded to the FastAPI backend.
      // The browser sees them as same-origin (localhost:5173/api/...)
      // so CORS is never triggered — even with withCredentials: true.
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Cookies set by the backend (e.g. refresh_token) are forwarded correctly
        secure: false,
      },
    },
  },
})
