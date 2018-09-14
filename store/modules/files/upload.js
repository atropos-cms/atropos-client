export const state = () => ({
  list: null,
  concurrency: 1
})

export const getters = {
  list (state) {
    return state.list
  },
  get: (state) => (id) => {
    if (!state.list) return null
    return state.list.find(u => u.id === id) || null
  },
  active (state) {
    if (!state.list) return null

    let uploading = state.list.filter(u => u.status === 'uploading')
    let queued = state.list.filter(u => u.status === 'queued')

    return uploading.concat(queued).slice(0, state.concurrency).map(u => u.id)
  }
}

export const mutations = {
  ADD_UPLOAD: (state, file) => {
    if (!state.list) {
      state.list = [file]
      return
    }
    state.list.push(file)
  },
  UPDATE_PROGRESS: (state, file) => {
    let entity = state.list.find(u => u.id === file.id)
    entity.status = 'uploading'
    entity.progress = file.progress

    // calculate speed
    var endTime = (new Date()).getTime()
    let upSpeed = Math.round(((file.loaded - entity.loaded) * 1000) / ((endTime - entity.updated) * 1024))

    entity.speed = upSpeed
    entity.loaded = file.loaded
    entity.updated = endTime
  },
  FINISH_UPLOAD: (state, file) => {
    let entity = state.list.find(u => u.id === file.id)
    entity.status = 'done'
    entity.progress = 100
  },
  REMOVE_UPLOAD: (state, file) => {
    let entityIndex = state.list.findIndex(u => u.id === file.id)
    state.list.splice(entityIndex, 1)
  },
  SET_CONCURRENCY: (state, concurrency) => {
    state.concurrency = Math.min(Math.max(concurrency, 1), 6)
  }
}

export const actions = {
  async AddUpload ({ commit, state }, entity) {
    let object = {
      id: entity.id,
      status: 'queued',
      progress: 0,
      loaded: 0,
      updated: 0,
      speed: 0,
      entity: entity
    }
    commit('ADD_UPLOAD', object)
    return object
  },
  async UpdateConcurrency ({ commit, state }, entity) {
    commit('UPDATE_PROGRESS', entity)

    let updatedEntity = state.list.find(u => u.id === entity.id)
    let concurrency = Math.round(updatedEntity.speed * 0.003)

    commit('SET_CONCURRENCY', concurrency)

    return entity
  },
  async FinishUpload ({ commit, state }, entity) {
    commit('FINISH_UPLOAD', entity)
    return entity
  },
  async RemoveUpload ({ commit, state }, entity) {
    commit('REMOVE_UPLOAD', entity)
    return entity
  }
}
