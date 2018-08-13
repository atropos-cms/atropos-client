import eventComponent from './-event-component'

export default {
  components: {
    eventComponent
  },

  async mounted () {
    return this.$apiWithoutErrorReporting(() => this.$store.dispatch('administration/users/GetUser', this.event.owner_id))
  },

  computed: {
    owner () {
      return this.$store.getters['administration/users/get'](this.event.owner_id)
    }
  }
}
