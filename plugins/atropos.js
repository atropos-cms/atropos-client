import Vue from 'vue'
import timeout from 'timeout-as-promise'
import Authorize from '~/utils/authorize'
import { enableErrorReporting, disableErrorReporting } from '~/utils/axios'
import helpTooltip from '~/components/helpTooltip'

// Global components
Vue.component('help-tooltip', helpTooltip)

// Helpers
export default (context) => {
  // Settings
  Vue.prototype.$setting = (setting) => {
    return context.store.getters['administration/settings/get'](setting)
  }

  const authorize = new Authorize(context)

  // Permissions
  Vue.prototype.$can = (permission) => authorize.can(permission)
  Vue.prototype.$canSome = (permissions) => authorize.canSome(permissions)
  Vue.prototype.$canEvery = (permissions) => authorize.canEvery(permissions)

  // Helpers
  Vue.prototype.$apiDisableErrorReporting = disableErrorReporting
  Vue.prototype.$apiEnableErrorReporting = enableErrorReporting

  Vue.prototype.$apiWithoutErrorReporting = async (callback) => {
    disableErrorReporting()
    let returnValue = await callback()
    enableErrorReporting()
    return returnValue
  }

  Vue.prototype.$timeout = timeout

  let idCounter = 1
  Vue.prototype.$generateUID = () => {
    return (idCounter++ * 29).toString(36)
  }
}
