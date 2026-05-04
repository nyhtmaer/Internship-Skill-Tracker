import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        // OAuth redirects need cookies to flow through
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // If backend sends a redirect to http://localhost:5173/... let the browser follow it
            if (proxyRes.headers.location?.startsWith('http://localhost:5173')) {
              res.writeHead(proxyRes.statusCode || 302, {
                ...proxyRes.headers,
                location: proxyRes.headers.location,
              });
              res.end();
            }
          });
        },
      },
    },
  },
})
