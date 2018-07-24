import fetch from '~/utils/fetch'

export async function GetGalleries () {
  let {data} = await fetch({
    url: '/modules/content/galleries',
    method: 'get'
  })
  return data
}

export async function GetGallery (id) {
  let {data} = await fetch({
    url: `/modules/content/galleries/${id}`,
    method: 'get'
  })
  return data
}

export async function CreateGallery (block) {
  let {data} = await fetch({
    url: `/modules/content/galleries`,
    method: 'post',
    data: block
  })
  return data
}

export async function UpdateGallery (block) {
  let {data} = await fetch({
    url: `/modules/content/galleries/${block.id}`,
    method: 'put',
    data: block
  })
  return data
}

export async function DeleteGallery (block) {
  let {data} = await fetch({
    url: `/modules/content/galleries/${block.id}`,
    method: 'delete'
  })
  return data
}
