import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  alias: {
    '#registry': fileURLToPath(new URL('./registry', import.meta.url)),
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['nuxt-shiki'],

  shiki: {
    defaultTheme: 'github-dark',
    defaultLang: 'typescript',
    bundledLangs: ['typescript', 'javascript', 'vue', 'vue-html', 'css', 'json', 'bash', 'html'],
    bundledThemes: ['github-dark', 'github-light'],
  },
})
