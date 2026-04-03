import { defineConfig } from 'vite'
export default defineConfig({
  server: {
    host: '0.0.0.0',    // ← add this
    port: 3000,
  }
})