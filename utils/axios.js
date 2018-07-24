import axios from 'axios'
import Raven from 'raven-js'
import { Message } from 'element-ui'
import { getAuth } from '~/utils/auth'
import { getTenant } from '~/utils/tenant'
import { updateApplicationLocale } from '~/utils/application'
import { i18nInstance } from '~/plugins/i18n'

// axios
const service = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 5000
})

// request
service.interceptors.request.use(config => {
  // Do something before request is sent
  let auth = getAuth()
  if (auth) {
    config.headers['Authorization'] = `Bearer ${auth}`
  }

  config.headers['X-Tenant'] = getTenant()

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone
service.interceptors.response.use(
  response => {
    // only set the application language on the server,
    // so we do not change the language for users that are already logged-in
    if (process.server) {
      updateApplicationLocale(response.headers['content-language'])
    }

    return response
  },
  error => {
    logError(error)
    return Promise.reject(error)
  }
)

let errorMessageInstance = null

const logError = (error) => {
  if (!process.client) return
  if (shouldNotReportError(error)) return

  Raven.captureException(error)

  if (!error.response) {
    throw new Error(error)
  }

  let message = (error.response && error.response.data.error && error.response.data.error.message.match(/([A-Z_]+):(.*)/)[2]) || error.message

  if (errorMessageInstance) errorMessageInstance.close()

  errorMessageInstance = handleErrorMessage({
    message: message,
    headers: error.response.headers,
    status: error.response.status
  })
}

const handleErrorMessage = ({message, status, headers}) => {
  if (status === 429) {
    return Message({
      message: i18nInstance.t('errors.too-many-requests', {retryAfter: headers['retry-after']}),
      type: 'error',
      duration: 5 * 1000
    })
  }

  if (message.match(/E_NO_TENANT_FOUND:.*/g)) {
    return this.$message({
      message: this.$t('errors.no-tenant-found'),
      type: 'error',
      duration: 8 * 1000
    })
  }

  return Message({
    message: message,
    type: 'error',
    duration: 5 * 1000
  })
}

const dontReportErrors = ['PVQ']

let disableErrorReportingCounter = 0

const shouldNotReportError = (error) => {
  if (disableErrorReportingCounter > 0) return true

  // don't report errors on /meta request
  if (error.config.url === `${error.config.baseURL}/meta`) return true

  if (!error.response) return false
  if (dontReportErrors.includes(error.response.data.error)) return true

  return false
}

export const enableErrorReporting = () => {
  if (disableErrorReportingCounter <= 0) {
    disableErrorReportingCounter = 0
    return
  }
  disableErrorReportingCounter--
}
export const disableErrorReporting = () => { disableErrorReportingCounter++ }

export default service
