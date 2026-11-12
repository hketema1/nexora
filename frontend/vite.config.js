import { defineConfig } from 'vite';

// Dev-only same-origin proxy: /api/budgets -> http://127.0.0.1:8000/budgets.
// Production hosting must supply its own reverse proxy or VITE_API_BASE_URL.
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
