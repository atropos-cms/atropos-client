import _ from 'lodash'
import { GetGalleries, GetGallery, CreateGallery, UpdateGallery, DeleteGallery } from '~/api/modules/content/galleries'

export const state = () => ({
  list: null
})

export const getters = {
  list (state) {
    return _.orderBy(state.list, ['order'])
  },
  get: (state) => (id) => {
    if (!state.list) return null
    return state.list.find(u => u.id === id)
  }
}

export const mutations = {
  SET_GALLERIES: (state, list) => {
    state.list = list || null
  },
  ADD_GALLERY: (state, gallery) => {
    if (!state.list) {
      state.list = [gallery]
      return
    }
    state.list.push(gallery)
  },
  UPDATE_GALLERY: (state, gallery) => {
    if (!state.list) {
      state.list = [gallery]
      return
    }

    let galleryIndex = state.list.findIndex(u => u.id === gallery.id)

    state.list.splice(galleryIndex, 1, gallery)
  },
  REMOVE_GALLERY: (state, gallery) => {
    let galleryIndex = state.list.findIndex(u => u.id === gallery.id)

    state.list.splice(galleryIndex, 1)
  }
}

export const actions = {
  async GetGalleries ({ commit, state }) {
    if (state.list) return state.list

    let data = await GetGalleries()
    commit('SET_GALLERIES', data)
    return data
  },
  async GetGallery ({ commit, dispatch, state, getters }, id) {
    let gallery = getters.get(id)
    if (gallery && gallery.images) return gallery

    await dispatch('GetGalleries')
    let data = await GetGallery(id)
    commit('UPDATE_GALLERY', data)
    return getters.get(id)
  },
  async CreateGallery ({ commit, state }, gallery) {
    let data = await CreateGallery(gallery)
    commit('ADD_GALLERY', data)
    return data
  },
  async UpdateGallery ({ commit, state }, gallery) {
    let data = await UpdateGallery(gallery)
    commit('UPDATE_GALLERY', data)
    return data
  },
  async DeleteGallery ({ commit, state }, gallery) {
    let data = await DeleteGallery(gallery)
    commit('REMOVE_GALLERY', gallery)
    return data
  }
}
