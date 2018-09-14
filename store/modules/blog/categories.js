import { GetCategories, GetCategory, CreateCategory, UpdateCategory, DeleteCategory } from '~/api/modules/blog/categories'
import { nullCategory } from '~/utils/nullObjects'

export const state = () => ({
  list: null
})

export const getters = {
  list (state) {
    return state.list
  },
  get: (state) => (id) => {
    if (!state.list) return nullCategory
    return state.list.find(u => u.id === id) || nullCategory
  }
}

export const mutations = {
  SET_CATEGORIES: (state, list) => {
    state.list = list || null
  },
  ADD_CATEGORY: (state, category) => {
    if (!state.list) {
      state.list = [category]
      return
    }
    state.list.push(category)
  },
  UPDATE_CATEGORY: (state, category) => {
    if (!state.list) {
      state.list = [category]
      return
    }

    let categoryIndex = state.list.findIndex(u => u.id === category.id)

    state.list.splice(categoryIndex, 1, category)
  },
  REMOVE_CATEGORY: (state, category) => {
    let categoryIndex = state.list.findIndex(u => u.id === category.id)

    state.list.splice(categoryIndex, 1)
  }
}

export const actions = {
  async GetCategories ({ commit, state }) {
    if (state.list) return state.list

    let data = await GetCategories()
    commit('SET_CATEGORIES', data)
    return data
  },
  async GetCategory ({ commit, dispatch, state, getters }, id) {
    if (getters.get(id) !== nullCategory) return getters.get(id)

    await dispatch('GetCategories')
    let data = await GetCategory(id)
    commit('UPDATE_CATEGORY', data)
    return getters.get(id)
  },
  async CreateCategory ({ commit, state }, category) {
    let data = await CreateCategory(category)
    commit('ADD_CATEGORY', data)
    return data
  },
  async UpdateCategory ({ commit, state }, category) {
    let data = await UpdateCategory(category)
    commit('UPDATE_CATEGORY', data)
    return data
  },
  async DeleteCategory ({ commit, state }, category) {
    let data = await DeleteCategory(category)
    commit('REMOVE_CATEGORY', category)
    return data
  }
}
