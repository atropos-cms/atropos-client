import fetch from '~/utils/fetch'

export async function getMeta () {
  try {
    let response = await fetch({
      url: '/meta',
      method: 'get'
    })
    return response && response.data ? response.data : null
  } catch (e) {
    return null
  }
}
