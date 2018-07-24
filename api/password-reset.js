import fetch from '~/utils/fetch'

export async function sendPasswordReset (uid) {
  const post = {
    uid
  }

  let {data} = await fetch({
    url: '/auth/password-reset',
    method: 'post',
    data: post
  })
  return data
}

export async function ResetPassword (post) {
  let {data} = await fetch({
    url: `/auth/password-reset`,
    method: 'put',
    data: post
  })
  return data
}
