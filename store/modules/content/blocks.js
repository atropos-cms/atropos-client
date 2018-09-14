import { GetBlocks, GetBlock, CreateBlock, UpdateBlock, DeleteBlock } from '~/api/modules/content/blocks'

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
  SET_BLOCKS: (state, list) => {
    state.list = list || null
  },
  ADD_BLOCK: (state, block) => {
    if (!state.list) {
      state.list = [block]
      return
    }
    state.list.push(block)
  },
  UPDATE_BLOCK: (state, block) => {
    if (!state.list) {
      state.list = [block]
      return
    }

    let blockIndex = state.list.findIndex(u => u.id === block.id)

    state.list.splice(blockIndex, 1, block)
  },
  REMOVE_BLOCK: (state, block) => {
    let blockIndex = state.list.findIndex(u => u.id === block.id)

    state.list.splice(blockIndex, 1)
  }
}

export const actions = {
  async GetBlocks ({ commit, state }) {
    if (state.list) return state.list

    let data = await GetBlocks()
    commit('SET_BLOCKS', data)
    return data
  },
  async GetBlock ({ commit, dispatch, state, getters }, id) {
    let block = getters.get(id)
    if (block && block.content) return block

    await dispatch('GetBlocks')
    let data = await GetBlock(id)
    commit('UPDATE_BLOCK', data)
    return getters.get(id)
  },
  async CreateBlock ({ commit, state }, block) {
    let data = await CreateBlock(block)
    commit('ADD_BLOCK', data)
    return data
  },
  async UpdateBlock ({ commit, state }, block) {
    let data = await UpdateBlock(block)
    commit('UPDATE_BLOCK', data)
    return data
  },
  async DeleteBlock ({ commit, state }, block) {
    let data = await DeleteBlock(block)
    commit('REMOVE_BLOCK', block)
    return data
  }
}
