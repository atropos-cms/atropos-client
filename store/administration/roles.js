import { GetRoles, GetRole, CreateRole, UpdateRole, DeleteRole } from '~/api/administration/roles'
import { nullRole } from '~/utils/nullObjects'
import _ from 'lodash'

export const state = () => ({
  list: null,
  listLoaded: false
})

export const getters = {
  list (state) {
    return _.orderBy(state.list, ['name'])
  },
  get: (state) => (id) => {
    if (!state.list) return nullRole
    return state.list.find(u => u.id === id) || nullRole
  }
}

export const mutations = {
  SET_ROLES: (state, list) => {
    state.list = list || null
    state.listLoaded = true
  },
  ADD_ROLE: (state, role) => {
    if (state.list === null) return
    state.list.push(role)
  },
  UPDATE_ROLE: (state, role) => {
    if (state.list === null) {
      state.list = []
    }

    let roleIndex = state.list.findIndex(u => u.id === role.id)

    if (roleIndex === -1) {
      state.list.push(role)
    } else {
      state.list.splice(roleIndex, 1, role)
    }
  },
  DELETE_ROLE: (state, role) => {
    if (state.list === null) return

    let roleIndex = state.list.findIndex(u => u.id === role.id)

    state.list.splice(roleIndex, 1)
  }
}

export const actions = {
  async GetRoles ({commit, state, getters}, {force} = {}) {
    if (state.listLoaded && !force) return state.list

    let data = await GetRoles()
    commit('SET_ROLES', data)
    return getters.list
  },
  async GetRole ({commit, state, getters}, id) {
    if (!id) return nullRole
    if (getters.get(id) !== nullRole) return getters.get(id)

    let data = await GetRole(id)
    commit('UPDATE_ROLE', data)
    return data
  },
  async CreateRole ({commit, state}, role) {
    let data = await CreateRole(role)
    commit('ADD_ROLE', data)
    return data
  },
  async UpdateRole ({commit, state}, role) {
    let data = await UpdateRole(role)
    commit('UPDATE_ROLE', data)
    return data
  },
  async DeleteRole ({commit, state}, role) {
    let data = await DeleteRole(role)
    commit('DELETE_ROLE', role)
    return data
  }
}
