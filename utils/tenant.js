export function getTenant (req) {
  if (process.env.TENANT_ID) return process.env.TENANT_ID

  if (req && process.server) {
    return req.headers.host.replace(/:([0-9]*)/, '')
  }

  if (!req && process.client) {
    return `${window.location.hostname}`
  }

  return ''
}
