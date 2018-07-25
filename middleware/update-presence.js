import Vue from 'vue'

export default async function ({ store, redirect, route }) {
  if (process.server) return

  const ws = Vue.prototype.$ws

  let channel = ws.getSubscription('presence')

  if (!channel) {
    channel = ws.subscribe('presence')
  }

  channel.emit('navigation', {
    route: route.name
  })
}
