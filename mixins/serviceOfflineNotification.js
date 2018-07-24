import EventBus from '~/utils/event-bus.js'
import displaysApiStatus from '~/mixins/displaysApiStatis.js'

export default {
  mixins: [displaysApiStatus],

  created () {
    EventBus.$on('ws--connection-recovered', this.recovered)
    EventBus.$on('ws--connection-closed', this.closed)
    EventBus.$on('ws--connection-failed', this.failed)
  },

  destroyed () {
    EventBus.$off('ws--connection-recovered', this.recovered)
    EventBus.$off('ws--connection-closed', this.closed)
    EventBus.$off('ws--connection-failed', this.failed)
  },

  data () {
    return {
      notificationTimer: null,
      closedNotificationInstance: null,
      failedNotificationInstance: null
    }
  },

  methods: {
    recovered () {
      if (!this.notificationTimer && !this.closedNotificationInstance) return

      if (this.notificationTimer && !this.closedNotificationInstance) {
        clearTimeout(this.notificationTimer)
        return
      }

      this._closeOpenNotifications()

      this.$notify({
        title: this.$t('message.ws-connection-recovered-title'),
        offset: 60,
        duration: 3000
      })
    },
    closed () {
      this._closeOpenNotifications()

      this.notificationTimer = setTimeout(() => {
        this.notificationTimer = null
        this.closedNotificationInstance = this.$notify({
          type: 'error',
          title: this.$t('message.ws-connection-closed-title'),
          message: this.$t('message.ws-connection-closed-message'),
          offset: 60,
          duration: 0,
          showClose: false,
          dangerouslyUseHTMLString: true
        })
      }, 10 * 1000)
    },
    failed () {
      this._closeOpenNotifications()

      this.notificationTimer = setTimeout(() => {
        this.notificationTimer = null
        this.failedNotificationInstance = this.$notify({
          type: 'error',
          title: this.$t('message.ws-connection-failed-title'),
          message: this.$t('message.ws-connection-failed-message'),
          offset: 60,
          duration: 0,
          showClose: false,
          dangerouslyUseHTMLString: true
        })
      }, 1000)

      this.$root.error({ statusCode: 503, message: 'message.ws-connection-failed-title' })
    },

    _closeOpenNotifications () {
      if (this.closedNotificationInstance) {
        this.closedNotificationInstance.close()
      }

      if (this.failedNotificationInstance) {
        this.failedNotificationInstance.close()
      }
    }
  }
}
