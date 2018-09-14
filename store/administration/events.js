import { GetEvents, GetEvent, DeleteEvent } from '~/api/administration/events'

export const state = () => ({
  list: null
})

export const getters = {
  list (state) {
    return state.list || []
  },
  loaded (state) {
    return state.list !== null
  },
  get: (state) => (id) => {
    return state.list.find(u => u.id === id) || null
  }
}

export const mutations = {
  SET_EVENTS: (state, list) => {
    state.list = list || null
  },
  ADD_EVENT: (state, event) => {
    if (state.list === null) return
    state.list.push(event)
  },
  DELETE_EVENT: (state, event) => {
    if (state.list === null) return

    let eventIndex = state.list.findIndex(u => u.id === event.id)

    state.list.splice(eventIndex, 1)
  }
}

export const actions = {
  async GetEvents ({ commit, state }) {
    let data = await GetEvents()
    commit('SET_EVENTS', data)
    return data
  },
  async GetEvent ({ commit, state, getters }, id) {
    if (!id) return null
    if (getters.get(id) !== null) return getters.get(id)

    let data = await GetEvent(id)
    commit('UPDATE_EVENT', data)
    return data
  },
  async DeleteEvent ({ commit, state }, event) {
    let data = await DeleteEvent(event)
    commit('DELETE_EVENT', event)
    return data
  }
}
