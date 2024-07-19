import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_BASE_URL': JSON.stringify(env.REACT_APP_BASE_URL),

      'import.meta.env.REACT_APP_FIREBASE_API_KEY': JSON.stringify(env.REACT_APP_FIREBASE_API_KEY),

      'import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.REACT_APP_FIREBASE_AUTH_DOMAIN),

      'import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.REACT_APP_FIREBASE_STORAGE_BUCKET),

      'import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID),

      'import.meta.env.REACT_APP_FIREBASE_APP_ID': JSON.stringify(env.REACT_APP_FIREBASE_APP_ID),
    },
    plugins: [react()],
  }
})