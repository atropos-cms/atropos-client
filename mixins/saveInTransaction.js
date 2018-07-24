import timeout from 'timeout-as-promise'

export default {
  data () {
    return {
      isSaving: false
    }
  },

  methods: {
    async saveInTransaction (closure) {
      this.isSaving = true

      try {
        // if there was an error, ignore it and hide the save indicator
        await Promise.all([closure(), timeout(800)])

        this.$message({
          message: this.$t('message.changes-successfully-saved'),
          type: 'success',
          duration: 3 * 1000
        })
      } catch (exception) {
        throw new Error(exception)
      } finally {
        this.isSaving = false
      }
    }
  }
}
