export default {
  computed: {
    apiConnected () {
      return this.$store.getters['apiConnected'] !== false
    }
  }
}
