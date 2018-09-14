import fetch from '~/utils/fetch'

export async function GetCategories () {
  let { data } = await fetch({
    url: '/modules/blog/categories',
    method: 'get'
  })
  return data
}

export async function GetCategory (id) {
  let { data } = await fetch({
    url: `/modules/blog/categories/${id}`,
    method: 'get'
  })
  return data
}

export async function CreateCategory (post) {
  let { data } = await fetch({
    url: `/modules/blog/categories`,
    method: 'post',
    data: post
  })
  return data
}

export async function UpdateCategory (post) {
  let { data } = await fetch({
    url: `/modules/blog/categories/${post.id}`,
    method: 'put',
    data: post
  })
  return data
}

export async function DeleteCategory (post) {
  let { data } = await fetch({
    url: `/modules/blog/categories/${post.id}`,
    method: 'delete'
  })
  return data
}
