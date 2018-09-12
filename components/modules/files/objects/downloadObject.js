import { RequestDownloadToken, StatusDownloadToken } from '~/api/modules/files/objects'

export default {
  methods: {
    // Download Object
    async downloadObject (fileId) {
      let {token, file} = await this.waitForDownloadToken(fileId)
      this.downloadObjectBlob(token, file)
    },

    async waitForDownloadToken (fileId, type = undefined) {
      let id = (typeof fileId === 'object') ? fileId[0] : fileId
      let selectedTeamId = this.$store.getters['modules/files/selectedTeam']
      let file = this.$store.getters['modules/files/object'](id)

      if (!file) {
        throw Error(`waitForDownloadToken: could not locate file with id: ${fileId}`)
      }

      if (file.status !== 'ready') return

      let token = await this.requestObjectDownload(selectedTeamId, file, type)
      token = await this._isReadyForDownload(token, file)
        .catch(token => {
          this.$message.error(this.$t('errors.error-while-preparing-download'))
        })

      return {token, file}
    },

    async requestObjectDownload (selectedTeamId, file, type) {
      return RequestDownloadToken(selectedTeamId, file.id, type)
    },

    async statusObjectDownload (file) {
      return StatusDownloadToken(file.team_id, file.id)
    },

    async _isReadyForDownload (token, file) {
      return new Promise(async (resolve, reject) => {
        let backgroundTask

        // create a new backgroundTask
        if (token.status !== 'OK') {
          backgroundTask = await this.$store.dispatch('ui/addBackgroundTask', {
            type: 'preparing-downloads',
            name: 'zipping',
            params: {name: file.name}
          })
        }

        // wait until the task is done
        while (token.status !== 'OK' && token.status !== 'FAILED') {
          await this.$timeout(1500)
          token = await StatusDownloadToken(token.id)
        }

        // remove the backgroundTask
        if (backgroundTask) {
          this.$store.dispatch('ui/removeBackgroundTask', backgroundTask)
        }

        if (token.status === 'FAILED') {
          reject(token)
        }

        resolve(token)
      })
    },

    async downloadObjectBlob (token, file) {
      await this._downloadAsBlob(token, file)
    },

    async _downloadAsBlob (token, file) {
      const link = document.createElement('a')
      link.style.display = 'none'

      link.href = token.url

      link.setAttribute('download', token.file_name)
      // Safari thinks _blank anchor are pop ups. We only want to set _blank
      // target if the browser does not support the HTML5 download attribute.
      // This allows you to download files in desktop safari if pop up blocking
      // is enabled.
      if (typeof link.download === 'undefined') {
        link.setAttribute('target', '_blank')
      }

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
