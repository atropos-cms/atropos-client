import { GetFiles, GetFile, CreateFile, UpdateFile, DeleteFile, DownloadURL } from '~/api/modules/media/files'
import _ from 'lodash'

export const state = () => ({
  // Files
  files: [],
  selectedFile: null
})

export const getters = {
  // Files
  files (state) {
    let files = state.files.filter(f => f.browsable && f.download_url && !f.upload_token)
    return _.orderBy(files, ['name'], ['asc'])
  },
  file: (state, getters) => (id) => {
    return state.files.find(u => u.id === id)
  },
  hasFiles (state) {
    return !!state.files.length
  },
  selectedFile (state) {
    return state.selectedFile
  },
  download: (state, getters) => (id, type = null, size = null) => {
    return DownloadURL(id, type, size)
  }
}

export const mutations = {
  // Files
  ADD_FILES: (state, data) => {
    let filesInStore = state.files.map(f => f.id)
    let newFiles = data.filter(f => !filesInStore.includes(f.id))

    state.files = state.files.concat(newFiles)
  },
  UPDATE_FILE: (state, file) => {
    let fileIndex = state.files.findIndex(t => t.id === file.id)

    if (fileIndex === -1) {
      return state.files.push(file)
    }

    return state.files.splice(fileIndex, 1, file)
  },
  DELETE_FILE: (state, file) => {
    let fileIndex = state.files.findIndex(t => t.id === file.id)

    if (fileIndex === -1) return

    return state.files.splice(fileIndex, 1)
  },
  SET_SELECTED_FILE: (state, file) => {
    state.selectedFile = file
  }
}

export const actions = {
  // Files
  async GetFiles ({commit, state, getters}) {
    if (state.files.length) return getters.files

    let currentPage = 1
    let {data, pagination} = await GetFiles({page: currentPage})
    let lastPage = pagination.lastPage

    commit('ADD_FILES', data)

    while (currentPage !== lastPage) {
      ++currentPage
      let {data} = await GetFiles({page: currentPage})
      commit('ADD_FILES', data)
    }

    return data
  },
  async GetFile ({commit, dispatch, state, getters}, id) {
    let file = getters.file(id)
    if (file) return file

    await dispatch('GetFiles')
    let data = await GetFile(id)
    commit('UPDATE_FILE', data)
    return data
  },
  async UpdateFile ({commit, state}, file) {
    let data = await UpdateFile(file)
    commit('UPDATE_FILE', data)
    return data
  },
  async CreateFile ({commit, state}, file) {
    let data = await CreateFile(file)
    commit('UPDATE_FILE', data)
    return data
  },
  async DeleteFile ({commit, state}, file) {
    let data = await DeleteFile(file)
    commit('DELETE_FILE', file)
    commit('SET_SELECTED_FILE', null)
    return data
  },
  async SelectFile ({commit, state}, file) {
    commit('SET_SELECTED_FILE', file)
  }
}
