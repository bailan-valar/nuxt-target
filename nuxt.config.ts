export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    },
    // Cloudflare Workers 配置
    experimental: {
      wasm: true
    }
  },
  vite: {
    server: {
      allowedHosts: ['.trycloudflare.com', '.loca.lt']
    }
  }
})
