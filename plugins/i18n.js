import Vue from 'vue'
import VueI18n from 'vue-i18n'
import localeEN from 'static/locales/en.json'
import elementEN from 'element-ui/lib/locale/lang/en'
import localeDE from 'static/locales/de.json'
import elementDE from 'element-ui/lib/locale/lang/de'

Vue.use(VueI18n)

export const i18nInstance = new VueI18n({
  locale: process.env.LANG || 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      ...localeEN,
      ...elementEN
    },

    de: {
      ...localeDE,
      ...elementDE
    }
  }
})

export default ({ app }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = i18nInstance
}
