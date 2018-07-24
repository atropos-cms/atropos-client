import fetch from '~/utils/fetch'

export async function GetEvents () {
  let {data} = await fetch({
    url: `/administration/events`,
    method: 'get'
  })
  return data
}

export async function GetEvent (id) {
  let {data} = await fetch({
    url: `/administration/events/${id}`,
    method: 'get'
  })
  return data
}

export async function DeleteEvent (post) {
  let {data} = await fetch({
    url: `/administration/events/${post.id}`,
    method: 'delete'
  })
  return data
}
