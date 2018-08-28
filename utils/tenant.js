let cachedTenant = null

export function resetTenantCache () {
  cachedTenant = null
}

export function getTenant (req) {
  if (process.env.TENANT_ID) return process.env.TENANT_ID

  let hostname = cachedTenant

  if (req && process.server) {
    cachedTenant = hostname = req.headers.host.replace(/:([0-9]*)/, '')
  }

  if (!req && process.client) {
    cachedTenant = hostname = `${window.location.hostname}`
  }

  return (hostname || '')
}
