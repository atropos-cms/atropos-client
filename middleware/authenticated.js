const guestRoutes = [
  'auth-login',
  'auth-reset',
  'auth-reset-all'
]

const ignoreRedirect = [
  '/',
  '/auth',
  '/auth/logout'
]

export default async function ({ store, redirect, route }) {
  // If the user is authenticated it's all good
  if (store.getters['profile/loggedIn']) return

  // if the user is on the login page
  if (guestRoutes.includes(route.name)) return

  // Add the current route as parameter if it is not ignored
  if (!ignoreRedirect.includes(route.path)) {
    return redirect('/auth/login', {redirect: route.path})
  }

  // redirect back to the login page
  return redirect('/auth/login')
}
