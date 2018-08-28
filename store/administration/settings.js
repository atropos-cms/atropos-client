import { GetSettings, UpdateSettings } from '~/api/administration/settings'

export const state = () => ({
  settings: {
    locale: process.env.LANG
  }
})

export const getters = {
  all (state) {
    return state.settings || {}
  },
  get: (state) => (key) => {
    if (!state.settings) return null
    return state.settings[key]
  },
  loaded (state) {
    return state.settings !== null
  }
}

export const mutations = {
  SET_SETTINGS: (state, settings) => {
    state.settings = {...state.settings, ...settings}
  }
}

export const actions = {
  async GetSettings ({commit, state}, {stats} = {stats: false}) {
    let data = await GetSettings({stats})
    commit('SET_SETTINGS', data)

    return data
  },
  async GetSetting ({dispatch, state, getters}, key) {
    if (!key) return null
    if (getters.loaded) return getters.get(key)

    await dispatch('GetSettings')
    return getters.get(key)
  },
  async UpdateSettings ({commit, state}, settings) {
    let data = await UpdateSettings(settings)
    commit('SET_SETTINGS', data)

    return data
  }
}
