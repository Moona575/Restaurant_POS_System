import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Replace 3000 with your backend port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
