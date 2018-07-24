import axios from './axios'

// This map will store all promises of requests that are currently running
let dispatchedRequests = new Map()

const service = (args) => {
  let mapKey = generateMapKey(args)

  // if the key is already in the map, return the same promise
  if (dispatchedRequests.has(mapKey)) {
    return dispatchedRequests.get(mapKey)
  }

  // dispatch the request with axios
  let axiosPromise = axios(args)

  // save the returned promis in the map
  dispatchedRequests.set(mapKey, axiosPromise)

  // wrap the request promise in a new promise
  // this is required to remove the entry in the map
  return new Promise((resolve, reject) => {
    axiosPromise.then(response => {
      dispatchedRequests.delete(mapKey)
      resolve(response)
    }).catch(error => {
      dispatchedRequests.delete(mapKey)
      reject(error)
    })
  })
}

// generate a string from the object to get a key
const generateMapKey = (args) => {
  return JSON.stringify(args)
}

export default service
