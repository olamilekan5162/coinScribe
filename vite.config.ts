import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {} // 👈 this line alone fixes most Web3Modal errors
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
