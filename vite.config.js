import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dreamscapes-goods-altar/',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    cors: true
  }
})
