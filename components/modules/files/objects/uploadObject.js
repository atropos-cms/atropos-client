import fetch from '~/utils/fetch'

export default {
  methods: {
    // Upload Object
    async uploadObject ({file, parent}) {
      if (!(await this._validate(file))) return

      let fileEntity = await this._createObjectEntity({file, parent})

      await this._queueObject(fileEntity)

      let backgroundTask = await this._startBackgroundTask(fileEntity)

      await this._isQueuedForUploading(fileEntity)

      try {
        let uploadedObjectEntity = await this._uploadObject(file, fileEntity, backgroundTask)
        await this._updateObjectEntity(uploadedObjectEntity)
      } catch (e) {
        await this._removeObjectEntity(fileEntity)
        await this._completeBackgroundTask(backgroundTask)
        await this._displayErrorMessage(e)
      }
    },

    async _createObjectEntity ({file, parent}) {
      let parentId = parent || this.$store.getters['modules/files/parent']

      let name = file.name.lastIndexOf('.') > 0 ? file.name.substr(0, file.name.lastIndexOf('.')) : file.name
      let extension = file.name.lastIndexOf('.') > 0 ? file.name.substr(file.name.lastIndexOf('.')) : ''

      // new Object Object
      let fileObject = {
        kind: 'file',
        parent: parentId,
        name: name,
        file_extension: extension,
        mime_type: file.type,
        size: file.size,
        modified_at: new Date(file.lastModifiedDate)
      }

      let uploadObject = await this.$store.dispatch('modules/files/CreateObject', fileObject)
      await this.$store.dispatch('modules/files/SelectObject', [uploadObject.id])

      return uploadObject
    },

    async _uploadObject (file, fileEntity, backgroundTask) {
      // the file has been created, now upload the data to the upload url
      let formdata = new FormData()
      formdata.append('file', file)

      let {data} = await fetch({
        url: `/modules/files/upload/${fileEntity.upload_token}`,
        method: 'post',
        data: formdata,
        timeout: 3600000,
        onUploadProgress: async (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          await this._updateConcurrency({id: fileEntity.id, progress: percentCompleted, loaded: progressEvent.loaded})
          await this._progressBackgroundTask(backgroundTask, percentCompleted)
        }
      })

      await this._completeUpload({id: fileEntity.id})
      await this._completeBackgroundTask(backgroundTask)

      return data
    },

    async _removeObjectEntity (fileEntity) {
      await this.$store.dispatch('modules/files/upload/RemoveUpload', fileEntity)

      await this.$store.commit('modules/files/SET_SELECTED_OBJECTS', null)
      await this.$store.commit('modules/files/DELETE_OBJECT', fileEntity)
    },

    async _updateObjectEntity (fileEntity) {
      await this.$store.commit('modules/files/UPDATE_OBJECT', fileEntity)
    },

    async _queueObject (fileEntity) {
      await this.$store.dispatch('modules/files/upload/AddUpload', fileEntity)
    },

    async _isQueuedForUploading (fileEntity) {
      return new Promise((resolve, reject) => {
        let interval = setInterval(() => this._checkQueueForUploading(fileEntity, interval, resolve), 200)
      })
    },

    async _startBackgroundTask (params) {
      return this.$store.dispatch('ui/addBackgroundTask', {
        type: 'uploading-files',
        name: 'uploading-file',
        params: params
      })
    },

    async _progressBackgroundTask (task, progress) {
      return this.$store.dispatch('ui/updateBackgroundTask', {
        ...task,
        progress: progress
      })
    },

    async _completeBackgroundTask (task) {
      setTimeout(() => {
        this.$store.dispatch('ui/removeBackgroundTask', task)
      }, 3000)
    },

    async _updateConcurrency (fileEntity) {
      await this.$store.dispatch('modules/files/upload/UpdateConcurrency', fileEntity)
    },
    async _completeUpload (fileEntity) {
      await this.$store.dispatch('modules/files/upload/RemoveUpload', fileEntity)
    },

    _checkQueueForUploading (fileEntity, interval, resolve) {
      if (this.$store.getters['modules/files/upload/active'].includes(fileEntity.id)) {
        clearInterval(interval)
        resolve()
      }
    },

    async _validate (file) {
      // Check for maximal filesize
      if (file.size > 500 * 1000 * 1000) {
        this.$message({
          message: this.$t('errors.error-upload-file-to-large'),
          type: 'error',
          duration: 4 * 1000
        })

        return false
      }
      return true
    },

    async _displayErrorMessage (exception) {
      return this.$message({
        message: this.$t('errors.error-while-processing-upload'),
        type: 'error',
        duration: 4 * 1000
      })
    }
  }
}
