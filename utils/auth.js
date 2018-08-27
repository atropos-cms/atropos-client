import CookieParser from 'cookie'
import Cookies from 'js-cookie'
import Raven from 'raven-js'
import EventBus from '~/utils/event-bus.js'

const AuthKey = 'user-auth'
const AuthRefreshTokenKey = 'user-refresh-auth'
const rememberMeExpiration = 90

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

export function setAuth (auth) {
  // When the user loggs in, emit an event after 10ms
  // This allows the authentication process to finish first.
  setTimeout(() => {
    EventBus.$emit('auth--user-logged-in')
  }, 10)

  // set cached key
  cachedAuth = auth

  // set cookie
  let options = { expires: rememberMeExpiration }
  return Cookies.set(AuthKey, auth, options)
}

export function getRefresh (req) {
  if (req) {
    const jwtCookie = CookieParser.parse(req.headers.cookie)
    return jwtCookie[AuthRefreshTokenKey]
  }

  return Cookies.get(AuthRefreshTokenKey)
}

export function setRefresh (refreshToken) {
  // set cookie
  let options = { expires: rememberMeExpiration }
  return Cookies.set(AuthRefreshTokenKey, refreshToken, options)
}

export function removeAuth () {
  EventBus.$emit('auth--user-logged-out')

  // reset the cookie and the cached auth token
  cachedAuth = null
  return Cookies.remove(AuthKey)
}

export async function setUser (user) {
  Raven.setUserContext({
    ...user
  })

  Raven.captureBreadcrumb({
    message: 'User logged in',
    category: 'auth'
  })
}

export async function resetUser () {
  Raven.setUserContext()

  Raven.captureBreadcrumb({
    message: 'User logged out',
    category: 'auth'
  })
}
