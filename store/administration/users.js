import { GetUsers, GetUser, CreateUser, UpdateUser, DeleteUser } from '~/api/administration/users'
import { nullUser } from '~/utils/nullObjects'
import _ from 'lodash'

export const state = () => ({
  list: null,
  listLoaded: false
})

export const getters = {
  list (state) {
    return _.orderBy(state.list, ['full_name'])
  },
  get: (state) => (id) => {
    if (!state.list) return nullUser
    return state.list.find(u => u.id === id) || nullUser
  }
}

export const mutations = {
  SET_USERS: (state, list) => {
    state.list = list || null
    state.listLoaded = true
  },
  ADD_USER: (state, user) => {
    if (state.list === null) {
      state.list = [user]
    }

    state.list.push(user)
  },
  UPDATE_USER: (state, user) => {
    if (!user) return

    if (state.list === null) {
      state.list = []
    }

    let userIndex = state.list.findIndex(u => u.id === user.id)

    if (userIndex === -1) {
      state.list.push(user)
    } else {
      state.list.splice(userIndex, 1, user)
    }
  },
  DELETE_USER: (state, user) => {
    if (state.list === null) return

    let userIndex = state.list.findIndex(u => u.id === user.id)
    state.list.splice(userIndex, 1)
  }
}

export const actions = {
  async GetUsers ({commit, state, getters}) {
    if (state.listLoaded) return state.list

    let data = await GetUsers()
    commit('SET_USERS', data)
    return getters.list
  },
  async GetUser ({commit, state, getters}, id) {
    if (!id) return nullUser
    if (getters.get(id) !== nullUser) return getters.get(id)

    let data = await GetUser(id)
    commit('UPDATE_USER', data)
    return data
  },
  async CreateUser ({commit, state}, user) {
    let data = await CreateUser(user)
    commit('ADD_USER', data)
    return data
  },
  async UpdateUser ({commit, state, dispatch, rootGetters}, user) {
    let data = await UpdateUser(user)
    commit('UPDATE_USER', data)

    // check if the user is updating their own user,
    if (rootGetters['profile/id'] === data.id) {
      dispatch('profile/GetProfile', {force: true}, { root: true })
    }

    return data
  },
  async DeleteUser ({commit, state}, user) {
    let data = await DeleteUser(user)
    commit('DELETE_USER', user)
    return data
  }
}
