import fetch from '~/utils/fetch'

export async function GetUsers () {
  try {
    let { data } = await fetch({
      url: `/administration/users`,
      method: 'get'
    })
    return data
  } catch (e) {
  }
}

export async function GetUser (id) {
  try {
    let { data } = await fetch({
      url: `/administration/users/${id}`,
      method: 'get'
    })
    return data
  } catch (e) {
  }
}

export async function CreateUser (post) {
  let { data } = await fetch({
    url: `/administration/users`,
    method: 'post',
    data: post
  })
  return data
}

export async function UpdateUser (post) {
  let { data } = await fetch({
    url: `/administration/users/${post.id}`,
    method: 'put',
    data: post
  })
  return data
}

export async function DeleteUser (post) {
  let { data } = await fetch({
    url: `/administration/users/${post.id}`,
    method: 'delete'
  })
  return data
}
