import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'atropos',
    paths: [
      'ui.acceptedGdpr',
      'modules.files.index.view',
      'modules.files.index.info'
    ]
  })(store)
}
