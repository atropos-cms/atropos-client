import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'atropos',
    paths: [
      'ui.acceptedGdpr',
      'modules.files.view',
      'modules.files.info'
    ]
  })(store)
}
