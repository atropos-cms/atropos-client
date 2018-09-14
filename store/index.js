import MobileDetect from 'mobile-detect'
import { getMeta } from '~/api/meta'
import { refreshToken } from '~/api/login'
import { resetTenantCache, getTenant } from '~/utils/tenant'
import { i18nInstance } from '~/plugins/i18n'
import { resetAuthCache, setAuth, getAuth, removeAuth, setUser, getRefresh, setRefresh } from '~/utils/auth'
import { resetApplicationSetting, updateApplicationSettings } from '~/utils/application'

export const state = () => ({
  apiMeta: null,
  apiConnected: null,
  routeMeta: null
})

export const getters = {
  apiMeta (state) {
    return state.apiMeta
  },
  apiConnected (state) {
    return state.apiConnected
  },
  routeMeta (state) {
    return state.routeMeta
  }
}

export const mutations = {
  SET_APIMETA: (state, apiMeta) => {
    state.apiMeta = apiMeta || null
  },
  SET_API_CONNECTED: (state, connected) => {
    state.apiConnected = connected
  },
  SET_ROUTEMETA: (state, routeMeta) => {
    state.routeMeta = routeMeta || null
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch, getters }, { req }) {
    // reset the cached tokens and settings on each request,
    // so we do not leak information between requests
    resetAuthCache()
    resetTenantCache()
    resetApplicationSetting()

    // fetch the tennant from the request
    getTenant(req)

    let auth = await dispatch('refreshJWTToken', req)

    if (auth) {
      try {
        await commit('profile/SET_TOKEN', auth)
        await dispatch('profile/GetProfile', { serverInit: true })
        await dispatch('administration/settings/GetSettings')
      } catch (error) {
        await commit('profile/SET_TOKEN', null)
      }
    }

    // request meta data from the server
    // this will also update the locale on the i18n instance
    commit('SET_APIMETA', await getMeta())
    // update the locale in the store
    commit('administration/settings/SET_SETTINGS', { locale: i18nInstance.locale })

    // Collaps Sidebar if we are on a mobile device
    let md = new MobileDetect(req.headers['user-agent'])
    commit('ui/SET_SIDEBAR_COLLAPSED', !!md.mobile())
  },

  async nuxtClientInit ({ commit, dispatch, getters }) {
    let authToken = getters['profile/token']
    // user is authenticated
    if (authToken) {
      setAuth(authToken)

      let user = await dispatch('profile/GetProfile')
      setUser(user)

      // fetch all media files
      dispatch('modules/media/browser/GetFiles')
    } else {
      // user is not authenticated
      removeAuth()
    }

    // Update the applications settings
    let settings = getters['administration/settings/all']
    updateApplicationSettings(settings)
  },

  async refreshApiStatus ({ commit, dispatch }) {
    commit('SET_APIMETA', await getMeta())
  },

  async refreshJWTToken ({ commit, dispatch, getters }, req) {
    if (!getAuth(req)) return

    let token = getRefresh(req)

    try {
      let response = await refreshToken(token)

      setAuth(response.token.token)
      setRefresh(response.token.refreshToken)

      return response.token.token
    } catch (e) {}
  },

  setRouteMeta ({ commit }, routeMeta) {
    commit('SET_ROUTEMETA', routeMeta)
  }
}
