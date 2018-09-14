import fetch from '~/utils/fetch'

export async function GetTeams () {
  let { data } = await fetch({
    url: '/modules/files/teams',
    method: 'get'
  })
  return data
}

export async function GetTeam (id) {
  let { data } = await fetch({
    url: `/modules/files/teams/${id}`,
    method: 'get'
  })
  return data
}

export async function CreateTeam (post) {
  let { data } = await fetch({
    url: `/modules/files/teams`,
    method: 'post',
    data: post
  })
  return data
}

export async function UpdateTeam (post) {
  let { data } = await fetch({
    url: `/modules/files/teams/${post.id}`,
    method: 'put',
    data: post
  })
  return data
}

export async function DeleteTeam (post) {
  let { data } = await fetch({
    url: `/modules/files/teams/${post.id}`,
    method: 'delete'
  })
  return data
}
