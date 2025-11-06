import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // This is needed, or else Vite will try to find image in public
      include: ['**/*.jsx', '**/*.js'],
      // Enable JSX in .js files
      jsxInject: `import React from 'react'`,
    }),
    tailwindcss(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
})
