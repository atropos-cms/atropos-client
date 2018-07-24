import timeout from 'timeout-as-promise'

let timeoutInstance = null

export default {
  data () {
    return {
      _hasUnsavedChanges: false
    }
  },

  mounted () {
    timeoutInstance = setTimeout(this._timeoutWorker, 2000)
  },

  beforeDestroy () {
    this._workerSaveChanges(true)
    clearTimeout(timeoutInstance)
    timeoutInstance = null
  },

  methods: {
    async saveOnInterval (skipValidation = false) {},

    async saveNow () {
      await this._saveNow(true)
    },

    async _timeoutWorker () {
      let nextWorkerRun = await this._workerSaveChanges()
      timeoutInstance = setTimeout(this._timeoutWorker, nextWorkerRun)
    },

    async _workerSaveChanges (skipValidation = false) {
      // if we don't have unsaved changes, return
      if (!this._hasUnsavedChanges) return 3000

      // measure execution time, set saving indicator
      let t0 = performance.now()

      await this._saveNow(skipValidation)

      let t1 = performance.now()

      // the next save should be in 2s + 2* the time it took to execute this save
      // this prevents overlapping saves
      return (t1 - t0) + 2200
    },

    async _saveNow (skipValidation = false) {
      // reset unsaved changes status
      this._hasUnsavedChanges = false

      await this.$store.commit('ui/SET_HEADER_SHOW_SAVE_INDICATOR', true)

      // call the method on the component to save the changes
      // if there was an error, ignore it and hide the save indicator
      await Promise.all([this.saveOnInterval(skipValidation), timeout(2000)]).catch(() => {})

      // measure execution time, hide saving indicator
      this.$store.commit('ui/SET_HEADER_SHOW_SAVE_INDICATOR', false)
    }
  }
}
