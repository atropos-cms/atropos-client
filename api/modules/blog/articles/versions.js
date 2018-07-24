import fetch from '~/utils/fetch'

export async function GetVersions (articleID) {
  let {data} = await fetch({
    url: `/modules/blog/articles/${articleID}/versions`,
    method: 'get'
  })
  return data
}

export async function GetVersion (articleID, id) {
  let {data} = await fetch({
    url: `/modules/blog/articles/${articleID}/versions/${id}`,
    method: 'get'
  })
  return data
}

export async function RestoreVersion (articleID, id) {
  let {data} = await fetch({
    url: `/modules/blog/articles/${articleID}/versions/${id}`,
    method: 'put'
  })
  return data
}
