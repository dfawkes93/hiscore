import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { host: true },
  build: {
      rollupOptions: {
          external: [
              "node-pre-gyp",
              "sqlite3",
              "sqlite",
              "mock-aws-s3",
              "nock",
              "aws-sdk"
          ]
      }
  }
})
