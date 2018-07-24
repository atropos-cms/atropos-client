let cachedTenant = null

export function getTenant (req) {
  if (process.env.TENANT_ID) return process.env.TENANT_ID

  let hostname = cachedTenant

  if (!hostname) {
    if (req && process.server) {
      hostname = req.headers.host.replace(/:([0-9]*)/, '')
    }

    if (!req && process.client) {
      hostname = `${window.location.hostname}`
    }
    cachedTenant = hostname
  }

  return (hostname || '')
}
