import EventBus from '~/utils/event-bus.js'

export default {
  data () {
    return {
      dragIsOverTarget: false,
      dragIsOverPage: false
    }
  },

  computed: {
    parent () {
      return this.$store.getters['modules/files/parent']
    }
  },

  methods: {
    dragover () {
      this.dragIsOverTarget = true
    },
    dragleave (event) {
      this.dragIsOverTarget = false
    },
    drop (event) {
      this.dragIsOverTarget = false

      this.processUploadTree(event)
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
      await this.getFilesFromEntries(entries, this.parent)
    },

    // Get the files of the webkit entries
    async getFilesFromEntries (entries, parent = null) {
      await Promise.all(
        entries.map(entry => this.traverseEntryTree(entry, parent))
      )
    },

    // Go through tree of entries and return a list of files
    async traverseEntryTree (entry, parent = null) {
      // This entry is a file, so we are done here
      if (entry.isFile) {
        entry.file(file => EventBus.$emit('modules-files-objects--upload-object', { file, parent }))
      }

      // This entry is a directory, we have to go deeper
      if (entry.isDirectory) {
        let directory = await this.$store.dispatch('modules/files/CreateObject', {
          kind: 'folder',
          parent: parent,
          name: entry.name
        })

        var dirReader = entry.createReader()
        dirReader.readEntries(entries => this.getFilesFromEntries(entries, directory.id))
      }
    }
  },

  mounted () {
    document.addEventListener('dragover', this.dragleave)
  }
}
