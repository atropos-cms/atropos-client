export default {
  methods: {
    iconFromMimetype (mimeType) {
      switch (this._mimetypeMap(mimeType)) {
        case 'audio':
          return 'library_music'

        case 'image':
          return 'photo_library'

        case 'pdf':
          return 'picture_as_pdf'

        case 'archive':
          return 'archive'

        default:
          return 'insert_drive_file'
      }
    },

    nameFromMimetype (mimeType) {
      return this._mimetypeMap(mimeType)
    },

    _mimetypeMap (mimeType) {
      switch (mimeType) {
        case 'audio/mpeg':
        case 'audio/mp3':
        case 'audio/ogg':
        case 'audio/midi':
        case 'audio/wav':
          return 'audio'

        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
          return 'image'

        case 'application/pdf':
          return 'pdf'

        case 'application/zip':
          return 'archive'

        default:
          return null
      }
    }
  }
}
