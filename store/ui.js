import { SIDEBAR_ROOT } from './.sidebar'

export const state = () => ({
  acceptedGdpr: false,
  backgroundTasks: [],
  headerShowBreadcrumb: false,
  headerShowSaveIndicator: false,
  sidebar: SIDEBAR_ROOT,
  showDashboardCarousel: false,
  sidebarIsCollapsed: false,
  showBrandingLogo: false,
  showFilters: false
})

export const getters = {
  acceptedGdpr (state) {
    return state.acceptedGdpr
  },
  backgroundTasks (state) {
    return state.backgroundTasks
  },
  hasBackgroundTasks (state) {
    return state.backgroundTasks.filter(task => !task.removed).length > 0
  },
  headerShowBreadcrumb (state) {
    return state.headerShowBreadcrumb
  },
  headerShowSaveIndicator (state) {
    return state.headerShowSaveIndicator
  },
  sidebar (state) {
    return state.sidebar
  },
  sidebarIsCollapsed (state) {
    return state.sidebarIsCollapsed
  },
  sidebarOpenSubmenu (state) {
    return flattenSidebar(state.sidebar)
      .filter(item => item.open)
      .map(item => item.name)
  },
  showBrandingLogo (state) {
    return state.showBrandingLogo
  },
  showFilters (state) {
    return state.showFilters
  },
  showDashboardCarousel (state) {
    return state.showDashboardCarousel
  }
}

export const mutations = {
  SET_ACCEPTED_GDPR (state, status) {
    state.acceptedGdpr = status
  },
  ADD_BACKGROUNDTASK (state, task) {
    state.backgroundTasks.push(task)
  },
  UPDATE_BACKGROUNDTASK (state, task) {
    let taskIndex = state.backgroundTasks.findIndex(t => t.id === task.id)

    state.backgroundTasks.splice(taskIndex, 1, task)
  },
  REMOVE_BACKGROUNDTASK (state, taskID) {
    let taskIndex = state.backgroundTasks.findIndex(t => t.id === taskID)

    state.backgroundTasks.splice(taskIndex, 1)
  },
  TOGGLE_SUBMENU (state, name) {
    let link = flattenSidebar(state.sidebar).find(link => link.name === name)
    link.open = !link.open
  },
  CLOSE_ALL_SUBMENU (state, name) {
    flattenSidebar(state.sidebar).forEach(link => { link.open = false })
  },
  OPEN_SUBMENU (state, name) {
    flattenSidebar(state.sidebar).find(link => link.name === name).open = true
  },
  CLOSE_SUBMENU (state, name) {
    flattenSidebar(state.sidebar).find(link => link.name === name).open = false
  },
  TOGGLE_SIDEBAR_COLLAPSED (state) {
    state.sidebarIsCollapsed = !state.sidebarIsCollapsed
  },
  SET_SIDEBAR_COLLAPSED (state, sidebarIsCollapsed) {
    state.sidebarIsCollapsed = sidebarIsCollapsed
  },
  SET_HEADER_SHOW_SAVE_INDICATOR (state, status) {
    state.headerShowSaveIndicator = status
  },
  SET_HEADER_SHOW_BREADCRUMB (state, status) {
    state.headerShowBreadcrumb = status
  },
  TOGGLE_SHOW_FILTERS (state, status) {
    state.showFilters = !state.showFilters
  },
  SET_BRANDING_LOGO (state, status) {
    state.showBrandingLogo = status
  },
  SET_SHOW_FILTERS (state, status) {
    state.showFilters = status
  },
  SET_SHOW_DASHBOARD_CAROUSEL (state, status) {
    state.showDashboardCarousel = status
  }
}

export const actions = {
  addBackgroundTask ({commit}, task) {
    let taskObject = {
      id: Math.random().toString(36).substr(2, 9),
      type: task.type || 'background-task',
      name: task.name || 'progress',
      params: task.params || {},
      progress: task.progress || undefined,
      removed: false
    }

    commit('ADD_BACKGROUNDTASK', taskObject)
    return taskObject
  },
  updateBackgroundTask ({commit}, task) {
    commit('UPDATE_BACKGROUNDTASK', task)
  },
  removeBackgroundTask ({commit, state}, task) {
    let taskID = task.id || task

    let taskObject = state.backgroundTasks.find(t => t.id === taskID)

    commit('UPDATE_BACKGROUNDTASK', {...taskObject, removed: true})

    setTimeout(() => {
      commit('REMOVE_BACKGROUNDTASK', taskID)
    }, 500)
  },
  openSubmenu ({commit}, name) {
    commit('CLOSE_ALL_SUBMENU')
    commit('OPEN_SUBMENU', name)
  },
  closeSubmenu ({commit}, name) {
    commit('CLOSE_SUBMENU', name)
  },
  toggleSubmenu ({commit}, name) {
    commit('CLOSE_ALL_SUBMENU')
    commit('TOGGLE_SUBMENU', name)
  },
  toggleSidebarCollapse ({commit}) {
    commit('TOGGLE_SIDEBAR_COLLAPSED')
  },
  toggleShowFilters ({commit}) {
    commit('TOGGLE_SHOW_FILTERS')
  }
}

/*
 * Flatten the sidebar into a one-dimentional array of all sidebar-elements
*/
const flattenSidebar = arr => arr.reduce((flat, item) => {
  if (item.children && Array.isArray(item.children)) {
    flat = flat.concat(flattenSidebar(item.children))
  }

  return flat.concat(item)
}, [])
