import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env to read VITE_API_BASE_URL at config time
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tailwindcss(),
      react(),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://makeasite-backend.onrender.com',
          changeOrigin: true,
        },
      },
    },
  }
})
