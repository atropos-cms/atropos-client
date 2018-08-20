export default {
  methods: {
    // Download Object
    async downloadMediaFile (fileId) {
      console.log(fileId)
      let file = this.$store.getters['modules/media/browser/file'](fileId)

      this.downloadObjectBlob(file)
    },

    async downloadObjectBlob (token, file) {
      await this._downloadAsBlob(token, file)
    },

    async _downloadAsBlob (file) {
      const link = document.createElement('a')
      link.style.display = 'none'

      link.href = file.download_url

      link.setAttribute('download', file.name)
      link.setAttribute('target', '_blank')

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
