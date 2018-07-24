import MobileDetect from 'mobile-detect'
import { getMeta } from '~/api/meta'
import { getTenant } from '~/utils/tenant'
import { i18nInstance } from '~/plugins/i18n'
import { getAuth, removeAuth, setUser } from '~/utils/auth'
import { updateApplicationSettings } from '~/utils/application'

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
  async nuxtServerInit ({commit, dispatch, getters}, {req}) {
    commit('SET_APIMETA', await getMeta())

    commit('administration/settings/SET_SETTINGS', {locale: i18nInstance.locale})

    getTenant(req)

    let auth = getAuth(req)

    commit('profile/SET_TOKEN', auth)
    if (auth) {
      try {
        await dispatch('profile/GetProfile', { serverInit: true })
        await dispatch('administration/settings/GetSettings')
      } catch (error) {
        await commit('profile/SET_TOKEN', null)
      }
    }

    // Collaps Sidebar if we are on a mobile device
    let md = new MobileDetect(req.headers['user-agent'])
    commit('ui/SET_SIDEBAR_COLLAPSED', !!md.mobile())
  },

  async nuxtClientInit ({commit, dispatch, getters}) {
    // user is authenticated
    if (getters['profile/token']) {
      let user = await dispatch('profile/GetProfile')
      setUser(user)
    } else {
      // user is not authenticated
      removeAuth()
    }

    // Update the applications settings
    let settings = getters['administration/settings/all']
    updateApplicationSettings(settings)
  },

  async refreshApiStatus ({commit, dispatch}) {
    commit('SET_APIMETA', await getMeta())
  },

  setRouteMeta ({commit}, routeMeta) {
    commit('SET_ROUTEMETA', routeMeta)
  }
}
