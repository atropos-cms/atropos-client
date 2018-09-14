import moment from 'moment'
import fuzzysearch from 'fuzzysearch'

export function filter (item, filters) {
  // Published
  if (!filterPublished(item, filters)) return false
  if (!filterTitle(item, filters)) return false

  return true
}

export function filterPublished (item, filters) {
  // Published filter not set
  if (!filters.published) return true

  // Draft
  if (filters.published === 'draft') {
    return item.published_at === null
  }

  // Published
  if (filters.published === 'published') {
    return moment(item.published_at).isBefore()
  }

  // Scheduled
  if (filters.published === 'scheduled') {
    return moment(item.published_at).isAfter()
  }

  return false
}

export function filterTitle (item, filters) {
  if (!filters.title) return true

  return fuzzysearch(filters.title, item.title)
}

export function paginate (list, { currentPage, pageSize }) {
  --currentPage // because pages logically start with 1, but technically with 0
  let total = list.length

  list = list.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  return { list, total: total }
}
