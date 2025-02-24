import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/server': {
        target: 'http://localhost:3006', // Make sure this matches your backend URL
        changeOrigin: true,  // Allows virtual hosting to be handled correctly
        secure: false, // Disable SSL verification (only if your backend is HTTP)
      },
    },
  },
  plugins: [react()],
});
