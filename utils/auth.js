import CookieParser from 'cookie'
import Cookies from 'js-cookie'
import Raven from 'raven-js'
import EventBus from '~/utils/event-bus.js'

const AuthKey = 'user-auth'
const rememberMeExpiration = 180
const noRememberExpiration = 1

let cachedAuth = null

export function getAuth (req) {
  if (req) {
    cachedAuth = getAuthFromRequest(req)
  } else {
    cachedAuth = cachedAuth || Cookies.get(AuthKey)
  }
  return cachedAuth
}

export function getAuthFromRequest (req) {
  if (!req.headers.cookie) return

  const jwtCookie = CookieParser.parse(req.headers.cookie)

  return jwtCookie[AuthKey]
}

export function setAuth (auth, rememberMe = false) {
  // When the user loggs in, emit an event after 10ms
  // This allows the authentication process to finish first.
  setTimeout(() => {
    EventBus.$emit('auth--user-logged-in')
  }, 10)

  let options = { expires: rememberMe ? rememberMeExpiration : noRememberExpiration }
  return Cookies.set(AuthKey, auth, options)
}

export function removeAuth () {
  EventBus.$emit('auth--user-logged-out')
  cachedAuth = null
  return Cookies.remove(AuthKey)
}

export async function setUser (user) {
  Raven.setUserContext({
    ...user
  })
}

export async function resetUser () {
  Raven.setUserContext()
}
