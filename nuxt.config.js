const webpack = require('webpack')
const path = require('path')
require('dotenv').config()

module.exports = {
  /*
  * Styles
  */
  css: [
    '~assets/styles/index'
  ],

  /*
  ** Headers of the page
  */
  head: {
    title: 'Atropos',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Atropos Community Software Client' },
      { 'http-equiv': 'x-ua-compatible', content: 'ie=edge,chrome=1' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400' }
    ]
  },

  /*
  ** Render Options
  */
  render: {
    csp: {
      enabled: true,
      allowedSources: []
    }
  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#69b3ff' },

  /*
  ** Router options
  */
  router: {
    base: '/',
    scrollBehaviour: () => ({
      x: 0,
      y: 0
    }),
    middleware: ['meta']
  },

  /*
   * Plugins
   */
  plugins: [
    { src: '~/plugins/sentry.js', ssr: false },
    { src: '~/plugins/element-ui.js', ssr: true },
    { src: '~/plugins/i18n.js', ssr: true },
    { src: '~/plugins/portal-vue.js', ssr: true },
    { src: '~/plugins/vue-clipboard2.js', ssr: true },
    { src: '~/plugins/vue-moment.js', ssr: true },
    { src: '~/plugins/vue-filters.js', ssr: true },
    { src: '~/plugins/vue-truncate.js', ssr: true },
    { src: '~/plugins/vue-async-computed.js', ssr: true },
    { src: '~/plugins/vue-click-outside.js', ssr: true },
    { src: '~/plugins/nuxt-client-init', ssr: false },
    { src: '~/plugins/vue-quill-editor', ssr: false },
    { src: '~/plugins/atropos.js', ssr: true },
    { src: '~/plugins/ws.js', ssr: false },
    { src: '~/plugins/local-storage.js', ssr: false }
  ],

  /*
   * Modules
   */
  modules: [
    '@nuxtjs/dotenv',
    '@nuxtjs/pwa'
  ],

  /*
   * Serviceworker oprions
   */
  workbox: {
    runtimeCaching: [
      {
        urlPattern: '/img/.*',
        handler: 'cacheFirst',
        method: 'GET'
      }
    ]
  },

  /*
  ** Build configuration
  */
  build: {
    publicPath: '/dist/',

    extractCSS: true,

    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|de/)
    ],

    /*
    ** Run ESLint on save
    */
    extend (config, { isDev }) {
      config.module.rules.push({
        test: /\.js$/,
        loader: 'imports-loader?window.Quill=quill',
        include: path.resolve('./node_modules/quill-image-resize-module')
      })

      if (isDev && process.server) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })

        config.devtool = 'eval-source-map'
      }
    }
  }
}
