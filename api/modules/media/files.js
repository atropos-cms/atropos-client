import fetch from '~/utils/fetch'

export async function GetFiles (options = { page: 1 }) {
  let { data } = await fetch({
    url: `/modules/media/files`,
    params: options,
    method: 'get'
  })
  return data
}

export async function GetFile (id) {
  let { data } = await fetch({
    url: `/modules/media/files/${id}`,
    method: 'get'
  })
  return data
}

export async function CreateFile (post) {
  let { data } = await fetch({
    url: `/modules/media/files`,
    method: 'post',
    data: post
  })
  return data
}

export async function UpdateFile (post) {
  let { data } = await fetch({
    url: `/modules/media/files/${post.id}`,
    method: 'put',
    data: post
  })
  return data
}

export async function DeleteFile (post) {
  let { data } = await fetch({
    url: `/modules/media/files/${post.id}`,
    method: 'delete'
  })
  return data
}

export function DownloadURL (id, type = null, size = null) {
  if (type && size) {
    return `${process.env.BASE_URL}/modules/media/files/${type}/${size}/${id}/download`
  }

  return `${process.env.BASE_URL}/modules/media/files/${id}/download`
}
