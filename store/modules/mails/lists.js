import { GetLists, GetList, CreateList, UpdateList, DeleteList } from '~/api/modules/mails/lists'

export const state = () => ({
  list: null
})

export const getters = {
  list (state) {
    return state.list
  },
  get: (state) => (id) => {
    if (!state.list) return null
    return state.list.find(u => u.id === id)
  }
}

export const mutations = {
  SET_LISTS: (state, list) => {
    state.list = list || null
  },
  ADD_LIST: (state, list) => {
    if (!state.list) {
      state.list = [list]
      return
    }
    state.list.push(list)
  },
  UPDATE_LIST: (state, list) => {
    if (!state.list) {
      state.list = [list]
      return
    }

    let listIndex = state.list.findIndex(u => u.id === list.id)

    state.list.splice(listIndex, 1, list)
  },
  REMOVE_LIST: (state, list) => {
    let listIndex = state.list.findIndex(u => u.id === list.id)

    state.list.splice(listIndex, 1)
  }
}

export const actions = {
  async GetLists ({commit, state}) {
    if (state.list) return state.list

    let data = await GetLists()
    commit('SET_LISTS', data)
    return data
  },
  async GetList ({commit, dispatch, state, getters}, id) {
    let list = getters.get(id)
    if (list) return list

    await dispatch('GetLists')
    let data = await GetList(id)
    commit('UPDATE_LIST', data)
    return getters.get(id)
  },
  async CreateList ({commit, state}, list) {
    let data = await CreateList(list)
    commit('ADD_LIST', data)
    return data
  },
  async UpdateList ({commit, state}, list) {
    let data = await UpdateList(list)
    commit('UPDATE_LIST', data)
    return data
  },
  async DeleteList ({commit, state}, list) {
    let data = await DeleteList(list)
    commit('REMOVE_LIST', list)
    return data
  }
}
