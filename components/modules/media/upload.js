import fetch from '~/utils/fetch'

export default {
  data () {
    return {
      showUploadProgress: false,
      uploadedFilesAreBrowsable: false,
      progress: {
        fileProgress: 0,
        total: 0,
        done: 0,
        current: {},
        previewSrc: null
      }
    }
  },

  methods: {
    // Upload File
    async uploadFiles (files) {
      // reset progress object
      this.progress = {
        fileProgress: 0,
        total: 0,
        done: 0,
        current: {},
        previewSrc: null
      }

      if (!Array.isArray(files)) {
        files = [files]
      }

      // upload count
      this.progress.total = files.length

      let fileEntities = []

      for (let file of files) {
        fileEntities.push(await this.uploadFile(file))
      }

      this.selectedFile(fileEntities)
    },

    async uploadFile (file) {
      this.progress.fileProgress = 0
      this.showUploadProgress = true

      this._createFilePreview(file)

      let fileEntity = await this._createFileObject(file)

      this.progress.fileProgress = 10

      let uploadedFileEntity = await this._uploadFile(file, fileEntity)
      this.progress.current = uploadedFileEntity

      await this._updateFileEntity(uploadedFileEntity)

      this.progress.done++

      this._revokeFilePreview()

      return uploadedFileEntity
    },

    async _createFilePreview (file) {
      // Make sure `file.name` matches our extensions criteria
      if (/\.(jpe?g|png|gif)$/i.test(file.name) === false) return

      this.progress.previewSrc = window.URL.createObjectURL(file)
    },

    async _revokeFilePreview () {
      if (!this.progress.previewSrc) return

      // revoke an existing blob to release memory
      window.URL.revokeObjectURL(this.progress.previewSrc)
    },

    async _createFileObject (file) {
      // new File Object
      let fileObject = {
        name: file.name.substr(0, file.name.lastIndexOf('.')),
        file_extension: file.name.substr(file.name.lastIndexOf('.')),
        mime_type: file.type,
        size: file.size,
        browsable: this.uploadedFilesAreBrowsable
      }

      return this.$store.dispatch('modules/media/browser/CreateFile', fileObject)
    },
    async _uploadFile (file, fileEntity) {
      // the file has been created, now upload the data to the upload url
      let formdata = new FormData()
      formdata.append('file', file)

      this.showUploadProgress = true

      let { data } = await fetch({
        url: `/modules/media/upload/${fileEntity.upload_token}`,
        method: 'post',
        data: formdata,
        timeout: 3600000,
        onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 90) / progressEvent.total)
          this._progressUpload(percentCompleted)
        }
      })

      this.showUploadProgress = false

      return data
    },
    async _updateFileEntity (fileEntity) {
      await this.$store.commit('modules/media/browser/UPDATE_FILE', fileEntity)
    },
    async _progressUpload (percentCompleted) {
      this.progress.fileProgress = percentCompleted + 10
    }
  }
}
