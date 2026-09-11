import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    watch: {
      ignored: ['**/*.pdf'],
    },
    proxy: {
      '/api/codechef': {
        target: 'https://codeindex.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
