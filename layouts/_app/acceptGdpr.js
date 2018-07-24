export default {
  computed: {
    acceptedGdpr () {
      return this.$store.getters['ui/acceptedGdpr']
    }
  },

  async mounted () {
    if (!process.client || !!this.acceptedGdpr) return

    await this.$timeout(900)

    this.$notify({
      title: this.$t('message.accept-gdpr-title'),
      message: this.$t('message.accept-gdpr-message'),
      type: 'info',
      duration: 0,
      onClose: this.acceptGdpr
    })
  },

  methods: {
    acceptGdpr () {
      return this.$store.commit('ui/SET_ACCEPTED_GDPR', new Date())
    }
  }
}
