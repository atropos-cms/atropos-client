import fetch from '~/utils/fetch'

export async function GetSettings ({stats}) {
  let includes = []
  if (stats) includes.push('stats')

  let {data} = await fetch({
    url: `/administration/settings?include=${includes.join(',')}`,
    method: 'get'
  })
  return data
}

export async function UpdateSettings (post) {
  let {data} = await fetch({
    url: `/administration/settings`,
    method: 'put',
    data: post
  })
  return data
}

export async function ClearServerCache () {
  let {data} = await fetch({
    url: `/administration/settings/clear-cache`,
    method: 'delete'
  })
  return data
}
