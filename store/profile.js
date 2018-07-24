import { getProfile, updateProfile, loginByUid, logout, sendEmailVerification, verifyEmail } from '~/api/login'
import { sendPasswordReset, ResetPassword } from '~/api/password-reset'
import { removeAuth, setAuth, setUser, resetUser } from '~/utils/auth'

export const state = () => ({
  token: null,
  profile: null
})

export const getters = {
  token (state) {
    return state.token
  },
  profile (state) {
    return state.profile
  },
  id (state) {
    return state.profile && state.profile.id
  },
  loggedIn (state) {
    return !!(state.token) && !!(state.profile)
  }
}

export const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token || null
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile
  }
}

export const actions = {
  async LoginByUid ({commit, dispatch}, userInfo) {
    const data = await loginByUid(userInfo.uid, userInfo.password)
    setAuth(data.token.token, userInfo.rememberMe)
    commit('SET_TOKEN', data.token.token)
    await dispatch('GetProfile')
    await dispatch('administration/settings/GetSettings', undefined, { root: true })
  },
  async GetProfile ({commit, state}, options = {}) {
    if (state.profile && !options.force) return state.profile

    let data = await getProfile()
    commit('SET_PROFILE', data)

    if (!options.serverInit) {
      setUser(data)
    }

    return data
  },
  async UpdateProfile ({commit, state}, profile) {
    let data = await updateProfile(profile)
    commit('SET_PROFILE', data)
    return data
  },
  async LogOut ({commit, state}) {
    commit('SET_TOKEN', null)
    commit('SET_PROFILE', null)

    await logout(state.token).catch(e => {})

    removeAuth()
    resetUser()
  },
  async SendEmailVerification ({commit, dispatch}) {
    await sendEmailVerification()
  },
  async VerifyEmail ({commit, dispatch}, token) {
    await verifyEmail(token)
  },
  async SendPasswordReset ({commit, dispatch}, userInfo) {
    await sendPasswordReset(userInfo.uid)
  },
  async ResetPassword ({commit, dispatch}, data) {
    await ResetPassword(data)
  }
}
