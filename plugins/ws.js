import 'babel-polyfill'
import Vue from 'vue'
import { getAuth } from '~/utils/auth'
import timeout from 'timeout-as-promise'
import EventBus from '~/utils/event-bus.js'
import Ws from '@adonisjs/websocket-client'

export default ({ app, store }, inject) => {
  const wsInstance = Ws(process.env.WS_URL)

  // register connection handler
  registerConnection(wsInstance, store)

  // Connect to the server
  connectToServer(wsInstance)

  // Inject ws into nuxt instance
  Vue.prototype.$ws = wsInstance
}

// Connect to server
function connectToServer (ws) {
  let auth = getAuth()

  // If the user is authenticated, use a token
  if (auth) {
    ws.withJwtToken(auth).connect()
    return
  }

  // otherwise, connect anonymously
  ws.connect()

  // and register a listener to reconnect on login
  EventBus.$on('auth--user-logged-in', async () => {
    disconnectFromServer(ws)
    await timeout(1000)
    connectToServer(ws)
  })
}

function disconnectFromServer (ws) {
  ws.close()
}

// Register a handler for tracking connection
function registerConnection (ws, store) {
  // ws.on('open', () => {
  //   if (store.getters['apiConnected'] !== null) {
  //     EventBus.$emit('ws--connection-recovered')
  //   }

  //   store.commit('SET_API_CONNECTED', true)
  // })

  // ws.on('close', (error) => {
  //   if (store.getters['apiConnected']) {
  //     EventBus.$emit('ws--connection-closed')
  //   }

  //   store.commit('SET_API_CONNECTED', false)

  //   if (error._reconnectionAttempts < error.options.reconnectionAttempts) return

  //   EventBus.$emit('ws--connection-failed')
  // })
}
