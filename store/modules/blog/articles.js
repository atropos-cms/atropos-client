import { GetArticles, GetArticle, CreateArticle, UpdateArticle, DeleteArticle } from '~/api/modules/blog/articles'
import { GetVersions, RestoreVersion } from '~/api/modules/blog/articles/versions'
import { filter } from '~/utils/storeHelpers'
import { paginate } from '../../../utils/storeHelpers'

export const state = () => ({
  list: null,
  filters: {
    published: null,
    title: null
  },
  pagination: {
    currentPage: 1,
    pageSize: 12
  }
})

export const getters = {
  list (state) {
    if (!state.list) return []
    return state.list
  },
  paginatedList (state) {
    if (!state.list) return []
    let list = state.list
      // filter by set criteria
      .filter(item => filter(item, state.filters))
      // custom sort by publish date
      .sort((a, b) => {
        if (a.published_at === null) {
          return -1
        } else if (b.published_at === null) {
          return 1
        } else if (a.published_at === b.published_at) {
          return a.title < b.title ? 1 : -1
        } else {
          return a.published_at < b.published_at ? 1 : -1
        }
      })

    return paginate(list, state.pagination)
  },
  count (state) {
    if (!state.list) return 0
    return state.list.length
  },
  filters (state) {
    return state.filters
  },
  pagination (state) {
    return state.pagination
  },
  get: (state) => (id) => {
    if (!state.list) return null
    return state.list.find(u => u.id === id)
  }
}

export const mutations = {
  SET_ARTICLES: (state, list) => {
    state.list = list || null
  },
  ADD_ARTICLE: (state, article) => {
    if (!state.list) {
      state.list = [article]
      return
    }
    state.list.push(article)
  },
  UPDATE_ARTICLE: (state, article) => {
    if (!state.list) {
      state.list = [article]
      return
    }

    let articleIndex = state.list.findIndex(u => u.id === article.id)

    state.list.splice(articleIndex, 1, article)
  },
  REMOVE_ARTICLE: (state, article) => {
    let articleIndex = state.list.findIndex(u => u.id === article.id)

    state.list.splice(articleIndex, 1)
  },
  SET_FILTERS: (state, filters) => {
    state.filters = filters
  },
  SET_PAGINATION: (state, pagination) => {
    state.pagination = pagination
  }
}

export const actions = {
  async GetArticles ({commit, state}) {
    if (state.list) return state.list

    let data = await GetArticles()
    commit('SET_ARTICLES', data)
    return data
  },
  async GetArticle ({commit, dispatch, state, getters}, id) {
    let article = getters.get(id)
    if (article && article.content) return article

    await dispatch('GetArticles')
    let data = await GetArticle(id)
    commit('UPDATE_ARTICLE', data)
    return getters.get(id)
  },
  async CreateArticle ({commit, state}, article) {
    let data = await CreateArticle(article)
    commit('ADD_ARTICLE', data)
    return data
  },
  async UpdateArticle ({commit, state}, article) {
    let data = await UpdateArticle(article)
    commit('UPDATE_ARTICLE', data)
    return data
  },
  async DeleteArticle ({commit, state}, article) {
    let data = await DeleteArticle(article)
    commit('REMOVE_ARTICLE', article)
    return data
  },

  async GetArticleVersions ({commit, dispatch, state, getters}, articleId) {
    let article = await dispatch('GetArticle', articleId)
    if (article && article.versions) return article.versions

    let data = await GetVersions(articleId)
    commit('UPDATE_ARTICLE', {
      ...article,
      versions: data
    })

    return getters.getVersions(articleId)
  },

  async RestoreArticleVersion ({commit, dispatch, state, getters}, {articleId, versionId}) {
    let article = await RestoreVersion(articleId, versionId)

    commit('UPDATE_ARTICLE', article)
  },

  async UpdateFilters ({commit, state}, filters) {
    commit('SET_FILTERS', filters)
  },

  async UpdatePagination ({commit, state}, pagination) {
    commit('SET_PAGINATION', pagination)
  }
}
