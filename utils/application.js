import { i18nInstance } from '~/plugins/i18n'
import moment from 'moment'

export function updateApplicationSettings (settings) {
  updateApplicationLocale(settings.locale)
}

export function updateApplicationLocale (locale) {
  // set localization for i18n if set
  if (locale && i18nInstance.locale !== locale) {
    i18nInstance.locale = locale
    moment.locale(locale)
  }
}
