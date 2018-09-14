import fetch from '~/utils/fetch'

export async function GetLists () {
  let { data } = await fetch({
    url: '/modules/mails/lists',
    method: 'get'
  })
  return data
}

export async function GetList (id) {
  let { data } = await fetch({
    url: `/modules/mails/lists/${id}`,
    method: 'get'
  })
  return data
}

export async function CreateList (post) {
  let { data } = await fetch({
    url: `/modules/mails/lists`,
    method: 'post',
    data: post
  })
  return data
}

export async function UpdateList (post) {
  let { data } = await fetch({
    url: `/modules/mails/lists/${post.id}`,
    method: 'put',
    data: post
  })
  return data
}

export async function DeleteList (post) {
  let { data } = await fetch({
    url: `/modules/mails/lists/${post.id}`,
    method: 'delete'
  })
  return data
}
