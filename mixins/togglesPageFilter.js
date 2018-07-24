export default {
  computed: {
    showFilters () {
      return this.$store.getters['ui/showFilters']
    }
  },

  methods: {
    async toggleFilters () {
      await this.$store.dispatch('ui/toggleShowFilters')
    }
  }
}
