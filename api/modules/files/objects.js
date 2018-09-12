import fetch from '~/utils/fetch'

export async function GetObjects (teamId, parent) {
  let {data} = await fetch({
    url: `/modules/files/${teamId}/objects?parent=${parent}`,
    method: 'get'
  })
  return data
}

export async function GetObject (teamId, id, {preview} = {preview: false}) {
  let includes = []
  if (preview) includes.push('preview')

  let {data} = await fetch({
    url: `/modules/files/${teamId}/objects/${id}?include=${includes.join(',')}`,
    method: 'get'
  })
  return data
}

export async function CreateObject (teamId, post) {
  let {data} = await fetch({
    url: `/modules/files/${teamId}/objects`,
    method: 'post',
    data: post
  })
  return data
}

export async function UpdateObject (teamId, post) {
  let {data} = await fetch({
    url: `/modules/files/${teamId}/objects/${post.id}`,
    method: 'put',
    data: post
  })
  return data
}

export async function DeleteObject (teamId, post) {
  let {data} = await fetch({
    url: `/modules/files/${teamId}/objects/${post.id}`,
    method: 'delete'
  })
  return data
}

export async function StarObject (teamId, post) {
  let {data} = await fetch({
    url: `/modules/files/${teamId}/objects/${post.id}/star`,
    method: 'post'
  })
  return data
}

export async function UnstarObject (teamId, post) {
  let {data} = await fetch({
    url: `/modules/files/${teamId}/objects/${post.id}/star`,
    method: 'delete'
  })
  return data
}

export async function RequestDownloadToken (teamId, fileId, type = undefined) {
  let {data} = await fetch({
    url: `/modules/files/${teamId}/objects/${fileId}/download`,
    method: 'post',
    data: {
      type
    }
  })
  return data
}

export async function StatusDownloadToken (tokenId) {
  let {data} = await fetch({
    url: `/modules/files/download/${tokenId}/status`,
    method: 'get'
  })
  return data
}
