import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        newproperty: 'new_property.html',
        propertyDetail: 'property-detail',
        register:'register',
        login: 'login',
        profile:'profile'
      }
    }
  }
});
