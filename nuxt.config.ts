// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  
  css: [
    '~/assets/css/main.css',
  ],
  
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/scss/variables.scss";',
        },
      },
    },
  },
  
  app: {
    head: {
      title: 'OIL Сервис - Профессиональное обслуживание автомобилей',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'OIL Сервис предлагает экспресс замену масла, диагностику и ремонт автомобилей. Бесплатная замена масла при покупке у нас!' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' },
      ],
    },
  },
  
  // Enable auto-imports
  imports: {
    dirs: ['stores'],
  },
  
  // Configure Pinia persistence
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate'],
  },
})
