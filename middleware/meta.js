export default ({ store, route }) => {
  let meta = route.meta.reduce((carry, meta) => Object.assign(carry, meta), {})

  store.dispatch('setRouteMeta', meta)

  store.commit('ui/SET_HEADER_SHOW_BREADCRUMB', !!meta.headerShowBreadcrumb)
}
