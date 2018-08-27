import fetch from '~/utils/fetch'

export async function loginByUid (uid, password, pvq) {
  const post = {
    uid,
    password,
    pvq
  }
  let {data} = await fetch({
    url: '/auth/login',
    method: 'post',
    data: post
  })
  return data
}

export async function refreshToken (refreshToken) {
  let {data} = await fetch({
    url: '/auth/refresh',
    method: 'post',
    data: {refreshToken}
  })
  return data
}

export async function logout () {
  let {data} = await fetch({
    url: '/auth/logout',
    method: 'post'
  })
  return data
}

export async function getProfile () {
  let {data} = await fetch({
    url: '/me',
    method: 'get'
  })
  return data
}

export async function updateProfile (post) {
  let {data} = await fetch({
    url: '/me',
    method: 'put',
    data: post
  })
  return data
}

export async function sendEmailVerification () {
  let {data} = await fetch({
    url: '/me/send-email-verification',
    method: 'post'
  })
  return data
}

export async function verifyEmail (token) {
  let {data} = await fetch({
    url: `/me/verify-email`,
    method: 'post',
    data: {token}
  })
  return data
}
