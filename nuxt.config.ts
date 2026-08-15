export default defineNuxtConfig({
  compatibilityDate: '2026-08-15',
  srcDir: 'app/',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Side Steps | 反復横跳びチャレンジ',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@500;700;900&family=Share+Tech+Mono&display=swap'
        }
      ]
    }
  }
})
