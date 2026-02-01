import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        newproperty: 'new-property.html',
        propertyDetail: 'property-detail.html',
        register:'register.html',
        login: 'login.html',
        profile:'profile.html'
      }
    }
  }
});
