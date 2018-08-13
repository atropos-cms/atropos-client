import { GetTeams, GetTeam, CreateTeam, UpdateTeam, DeleteTeam } from '~/api/modules/files/teams'
import { GetObjects, GetObject, CreateObject, UpdateObject, DeleteObject, StarObject, UnstarObject } from '~/api/modules/files/objects'
import _ from 'lodash'

export const state = () => ({
  // View
  view: 'list',
  info: false,

  // Teams
  teams: null,
  selectedTeam: null,

  // Objects
  objects: [],
  selectedObjects: [],
  parent: null,
  lockObjectSelection: false
})

export const getters = {
  // View
  view (state) {
    return state.view
  },
  info (state) {
    return state.info
  },

  // Teams
  teams (state) {
    return _.orderBy(state.teams, ['name'], ['asc'])
  },
  team: (state) => (id) => {
    if (!state.teams) return null
    return state.teams.find(u => u.id === id)
  },
  selectedTeam (state) {
    return state.selectedTeam
  },

  // Objects
  objects: (state) => (parent = undefined, team = undefined) => {
    if (parent === undefined) parent = state.parent
    if (team === undefined) team = state.selectedTeam

    if (parent === false) {
      return state.objects.reduce((carry, o) => carry.concat(o.value), [])
    }

    let teamObjects = state.objects.find(t => t.team === team && t.parent === parent)

    if (!teamObjects) {
      return null
    }

    return _.orderBy(teamObjects.value, ['kind', 'name'], ['desc', 'asc'])
  },
  object: (state, getters) => (id, parent = false, team = undefined) => {
    let teamObjects = getters.objects(parent, team)

    if (!teamObjects) return null
    return teamObjects.find(u => u.id === id)
  },
  selectedObjects (state) {
    return state.selectedObjects
  },
  parent (state) {
    return state.parent
  }
}

export const mutations = {
  // View
  SET_VIEW: (state, view) => {
    state.view = view
  },
  SET_INFO: (state, info) => {
    state.info = info
  },

  // Teams
  SET_TEAMS: (state, teams) => {
    state.teams = teams || null
  },
  ADD_TEAM: (state, team) => {
    if (!state.teams) {
      state.teams = [team]
      return
    }

    state.teams.push(team)
  },
  UPDATE_TEAM: (state, team) => {
    if (!state.teams) {
      state.teams = [team]
      return
    }

    let teamIndex = state.teams.findIndex(u => u.id === team.id)

    state.teams.splice(teamIndex, 1, team)
  },
  DELETE_TEAM: (state, team) => {
    if (!state.teams) return

    let teamIndex = state.teams.findIndex(u => u.id === team.id)

    if (teamIndex === -1) return

    state.teams.splice(teamIndex, 1)
  },
  SET_SELECTED_TEAM: (state, team) => {
    state.selectedTeam = team
  },

  // Objects
  SET_OBJECTS: (state, {team, parent, data}) => {
    let teamObjects = state.objects.find(t => t.team === team && t.parent === parent)

    if (teamObjects) {
      // teamObjects.value = teamObjects.value.map(v => Object.assign(v, data.find(d => d.id === v.id)))
      teamObjects.value = data.map(d => Object.assign({}, teamObjects.value.find(v => d.id === v.id), d))
      return
    }

    return state.objects.push({
      team: team,
      parent: parent,
      value: data
    })
  },
  UPDATE_OBJECT: (state, object) => {
    let teamObjects = state.objects.find(t => t.team === object.team_id && t.parent === object.parent_id)
    if (!teamObjects) {
      return state.objects.push({
        team: object.team_id,
        parent: object.parent_id,
        value: [object]
      })
    }

    let objectIndex = teamObjects.value.findIndex(t => t.id === object.id)

    if (objectIndex === -1) {
      return teamObjects.value.push(object)
    }

    return teamObjects.value.splice(objectIndex, 1, object)
  },
  DELETE_OBJECT: (state, object) => {
    let teamObjects = state.objects.find(t => t.team === object.team_id && t.parent === object.parent_id)
    if (!teamObjects) return

    let objectIndex = teamObjects.value.findIndex(t => t.id === object.id)

    if (objectIndex === -1) return

    return teamObjects.value.splice(objectIndex, 1)
  },
  SET_SELECTED_OBJECTS: (state, objects) => {
    state.selectedObjects = objects || []
  },
  SET_PARENT: (state, object) => {
    state.parent = object
  },
  SET_LOCK_OBJECT_SELECTION: (state, locked) => {
    state.lockObjectSelection = locked
  }
}

export const actions = {
  // View
  async ChangeView ({commit, state}, view) {
    commit('SET_VIEW', view)
  },
  async ShowInfo ({commit, state}, info) {
    commit('SET_INFO', info)
  },

  // Teams
  async GetTeams ({commit, statem, getters}) {
    if (state.teams) return state.teams

    let data = await GetTeams()
    commit('SET_TEAMS', data)

    return getters.teams
  },
  async GetTeam ({commit, dispatch, state, getters}, id) {
    let team = getters.getTeam(id)
    if (team) return team

    await dispatch('GetTeams')
    let data = await GetTeam(id)
    commit('UPDATE_TEAM', data)
    return getters.getTeam(id)
  },
  async CreateTeam ({commit, state}, team) {
    let data = await CreateTeam(team)
    commit('ADD_TEAM', data)
    return data
  },
  async UpdateTeam ({commit, state}, team) {
    let data = await UpdateTeam(team)
    commit('UPDATE_TEAM', data)
    return data
  },
  async DeleteTeam ({commit, state}, team) {
    let data = await DeleteTeam(team)
    commit('DELETE_TEAM', team)
    commit('SET_SELECTED_TEAM', null)
    return data
  },
  async SelectTeam ({commit, state, getters}, teamId) {
    let team = getters.team(teamId)

    if (!team && state.teams.length) {
      team = getters.teams[0]
    }

    if (!team.canRead) return

    commit('SET_SELECTED_TEAM', team.id)
    return team.id
  },

  // Objects
  async GetObjects ({commit, state, getters}, {force, parent, team} = {}) {
    if (!force && getters.objects(parent)) return getters.objects(parent)

    if (!state.selectedTeam) return

    let parentId = parent !== undefined ? parent : state.parent
    let teamId = team !== undefined ? team : state.selectedTeam

    let data = await GetObjects(teamId, parentId)
    commit('SET_OBJECTS', { team: teamId, parent: parentId, data })

    return data
  },
  async GetObject ({commit, dispatch, state, getters}, {id, team, preview} = {preview: false}) {
    let object = getters.object(id)

    // check for preview
    if (object && !object.has_preview) return object
    if (object && preview && object.preview) return object

    let teamId = team !== undefined ? team : state.selectedTeam

    await dispatch('GetObjects', {team: teamId})
    let data = await GetObject(teamId, id, {preview})
    commit('UPDATE_OBJECT', data)
    return data
  },
  async UpdateObject ({commit, state}, object) {
    let data = await UpdateObject(state.selectedTeam, object)
    commit('UPDATE_OBJECT', data)
    return data
  },
  async CreateObject ({commit, state}, object) {
    let data = await CreateObject(state.selectedTeam, object)
    commit('UPDATE_OBJECT', data)
    return data
  },
  async DeleteObject ({commit, state}, object) {
    commit('SET_SELECTED_OBJECTS', null)
    commit('DELETE_OBJECT', object)
    try {
      await DeleteObject(state.selectedTeam, object)
    } catch (e) {
      commit('UPDATE_OBJECT', object)
    }
    return object
  },
  async StarObject ({commit, state}, object) {
    let data = await StarObject(state.selectedTeam, object)
    commit('UPDATE_OBJECT', data)
    return data
  },
  async UnstarObject ({commit, state}, object) {
    let data = await UnstarObject(state.selectedTeam, object)
    commit('UPDATE_OBJECT', data)
    return data
  },
  async SelectObject ({commit, state}, objects) {
    if (state.lockObjectSelection) return
    commit('SET_SELECTED_OBJECTS', objects)
  },
  async OpenFolder ({commit, dispatch, state}, parentId) {
    parentId = !parentId || parentId === 'null' ? null : parentId
    commit('SET_PARENT', parentId)
    commit('SET_SELECTED_OBJECTS', null)

    if (!state.selectedTeam) return

    let data = await GetObjects(state.selectedTeam, state.parent)
    commit('SET_OBJECTS', { team: state.selectedTeam, parent: state.parent, data })
  },
  async ReloadFolder ({commit, dispatch, state}) {
    if (!state.selectedTeam) return

    let data = await GetObjects(state.selectedTeam, state.parent)
    commit('SET_OBJECTS', { team: state.selectedTeam, parent: state.parent, data })
  },
  async LockObjectSelection ({commit, state}, locked) {
    commit('SET_LOCK_OBJECT_SELECTION', locked)
  }
}
