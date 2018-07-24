import CookieParser from 'cookie'
import Cookies from 'js-cookie'
import Raven from 'raven-js'

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
  let options = { expires: rememberMe ? rememberMeExpiration : noRememberExpiration }
  return Cookies.set(AuthKey, auth, options)
}

export function removeAuth () {
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
