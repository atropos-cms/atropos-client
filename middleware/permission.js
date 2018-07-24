import Authorize from '~/utils/authorize'

const checkPermission = (context, meta, name) => {
  if (meta.permission === null) {
    return true
  }

  let authorize = new Authorize(context)

  if (meta.permission) {
    return authorize.can(meta.permission)
  }

  if (meta.somePermissions) {
    return authorize.some(meta.somePermissions)
  }

  if (meta.everyPermission) {
    return authorize.every(meta.everyPermission)
  }

  return authorize.can(name)
}

export default function ({ store, redirect, route, error }) {
  if (!route.name) return

  let name = route.name.replace('-id', '')
  let meta = route.meta[0] || {}

  if (meta && !checkPermission({store}, meta, name)) {
    error({ statusCode: 403, message: 'errors.permission-to-page-denied' })
  }
}
