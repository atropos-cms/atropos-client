import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
const { version } = require('../package.json')

Raven
  .config(process.env.SENTRY_DNS, {
    release: version,
    shouldSendCallback (data) {
      // Do not report error if...

      // There is no usefull message, caused by failed formvalidation
      if (data.extra.unhandledPromiseRejection && checkMessage(data, /(false)/)) {
        return false
      }

      // The last error was a form validation error
      if (data.extra.unhandledPromiseRejection && checkMessage(data, /(async-validator:)/)) {
        return false
      }

      // It was a canceled message dialog
      if (data.extra.unhandledPromiseRejection && checkMessage(data, /(cancel)/)) {
        return false
      }

      // Report all other errors
      return true
    }
  })
  .addPlugin(RavenVue, Vue)
  .install()

// Helper function to check error message
function checkMessage (data, regex) {
  // If the error matches the message, return
  if (data.message.match(regex)) return true

  // We will also check the last breadcrumb
  const lastBreadcrumb = data.breadcrumbs.values[data.breadcrumbs.values.length - 1]

  // If the message matches the last breadcrumb message, we will also return true
  if (lastBreadcrumb && lastBreadcrumb.message && lastBreadcrumb.message.match(regex)) return true

  // otherwise, nothing matched
  return false
}
