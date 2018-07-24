export default {
  data () {
    return {
      dragIsOverTarget: false
    }
  },

  async mounted () {
    document.addEventListener('dragover', this.dragleave)
  },

  methods: {
    dragover () {
      this.dragIsOverTarget = true
    },
    dragleave (event) {
      this.dragIsOverTarget = false
    },
    async drop (event) {
      this.dragIsOverTarget = false

      let files = await this.processUploadTree(event)

      if (!this.supportsAmount(files.length)) {
        this.multipleFilesNotSupported()
      }

      await this.uploadFiles(files)

      this.showUploadProgress = false
    },

    supportsFileType (type) {
      return true
    },

    supportsAmount (length) {
      return true
    },

    // Helper for taking the dataTransfer of a drop event.
    async processUploadTree (event) {
      // Get all entries from the event
      var items = event.dataTransfer.items
      var entries = []

      for (var i = 0; i < items.length; i++) {
        var entry = items[i].webkitGetAsEntry()
        if (entry) {
          entries.push(entry)
        }
      }

      // Get all files from the entries, even if they are deep in directories
      return this.getFilesFromEntries(entries)
    },

    // Get the files of the webkit entries
    async getFilesFromEntries (entries) {
      let promiseMap = await Promise.all(
        entries.map(entry => this.traverseEntryTree(entry))
      )

      return promiseMap.reduce((carry, e) => carry.concat(e), [])
    },

    // Go through tree of entries and return a list of files
    async traverseEntryTree (entry) {
      // This entry is a file, so we are done here
      if (entry.isFile) {
        return new Promise((resolve, reject) => {
          entry.file((file) => resolve([file]), reject)
        })
      }

      // This entry is a directory, we have to go deeper
      if (entry.isDirectory) {
        var dirReader = entry.createReader()
        return new Promise((resolve, reject) => {
          dirReader.readEntries(entries => resolve(this.getFilesFromEntries(entries), reject))
        })
      }
    }
  }
}
