import fetch from '~/utils/fetch'

export async function GetRoles () {
  try {
    let {data} = await fetch({
      url: `/administration/roles`,
      method: 'get'
    })
    return data
  } catch (e) {
  }
}

export async function GetRole (id) {
  try {
    let {data} = await fetch({
      url: `/administration/roles/${id}`,
      method: 'get'
    })
    return data
  } catch (e) {
  }
}

export async function CreateRole (post) {
  let {data} = await fetch({
    url: `/administration/roles`,
    method: 'post',
    data: post
  })
  return data
}

export async function UpdateRole (post) {
  let {data} = await fetch({
    url: `/administration/roles/${post.id}`,
    method: 'put',
    data: post
  })
  return data
}

export async function DeleteRole (post) {
  let {data} = await fetch({
    url: `/administration/roles/${post.id}`,
    method: 'delete'
  })
  return data
}
