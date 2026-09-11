import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'case-insensitive-certificates',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url && req.url.startsWith('/assets/certificates/')) {
            req.url = req.url.replace('/assets/certificates/', '/assets/Certificates/');
          }
          next();
        });
      },
    },
  ],
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
