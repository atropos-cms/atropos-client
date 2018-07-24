import fetch from '~/utils/fetch'

export async function GetArticles () {
  let {data} = await fetch({
    url: '/modules/blog/articles',
    method: 'get'
  })
  return data
}

export async function GetArticle (id) {
  let {data} = await fetch({
    url: `/modules/blog/articles/${id}`,
    method: 'get'
  })
  return data
}

export async function CreateArticle (post) {
  let {data} = await fetch({
    url: `/modules/blog/articles`,
    method: 'post',
    data: post
  })
  return data
}

export async function UpdateArticle (post) {
  let {data} = await fetch({
    url: `/modules/blog/articles/${post.id}`,
    method: 'put',
    data: post
  })
  return data
}

export async function DeleteArticle (post) {
  let {data} = await fetch({
    url: `/modules/blog/articles/${post.id}`,
    method: 'delete'
  })
  return data
}
