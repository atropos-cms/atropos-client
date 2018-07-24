import fetch from '~/utils/fetch'

export async function GetBlocks () {
  let {data} = await fetch({
    url: '/modules/content/blocks',
    method: 'get'
  })
  return data
}

export async function GetBlock (id) {
  let {data} = await fetch({
    url: `/modules/content/blocks/${id}`,
    method: 'get'
  })
  return data
}

export async function CreateBlock (block) {
  let {data} = await fetch({
    url: `/modules/content/blocks`,
    method: 'post',
    data: block
  })
  return data
}

export async function UpdateBlock (block) {
  let {data} = await fetch({
    url: `/modules/content/blocks/${block.id}`,
    method: 'put',
    data: block
  })
  return data
}

export async function DeleteBlock (block) {
  let {data} = await fetch({
    url: `/modules/content/blocks/${block.id}`,
    method: 'delete'
  })
  return data
}
