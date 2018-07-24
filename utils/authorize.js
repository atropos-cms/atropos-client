class Authorize {
  constructor ({ store }) {
    this._store = store
  }

  permissions () {
    let profile = this._store.getters['profile/profile']
    return (profile && profile.permissions) || []
  }

  can (permission) {
    return this.permissions().includes(permission)
  }

  canSome (permissions) {
    return this.permissions().some(p => permissions.includes(p))
  }

  canEvery (permissions) {
    return this.permissions().every(p => permissions.includes(p))
  }
}

export default Authorize
