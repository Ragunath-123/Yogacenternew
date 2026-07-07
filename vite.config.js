import { defineConfig } from 'vite';
import { resolve } from 'path';

// Multi-page Vite configuration for YogaLakshmi Wellness Center
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        products: resolve(__dirname, 'products.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
