import 'babel-polyfill'
import Vue from 'vue'
import EventBus from '~/utils/event-bus.js'
import Ws from '@adonisjs/websocket-client'

export default ({ app, store }, inject) => {
  const ws = Ws(process.env.WS_URL)

  ws.on('open', () => {
    if (store.getters['apiConnected'] !== null) {
      EventBus.$emit('ws--connection-recovered')
    }

    store.commit('SET_API_CONNECTED', true)
  })

  ws.on('close', (error) => {
    if (store.getters['apiConnected']) {
      EventBus.$emit('ws--connection-closed')
    }

    store.commit('SET_API_CONNECTED', false)

    if (error._reconnectionAttempts < error.options.reconnectionAttempts) return

    EventBus.$emit('ws--connection-failed')
  })

  // Connect to the server
  ws.connect()

  // Inject ws into nuxt instance
  Vue.prototype.$ws = ws
}
