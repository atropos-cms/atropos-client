<template lang="html">
  <div>
    <!-- Create Folder Dialog -->
    <create-folder-dialog
      :object-id="objectId"
      :visible.sync="showCreateFolderDialog"
      :before-close="unlockObjectSelection"
      @closed="closeCreateFolderDialog"/>

    <!-- Rename Object Dialog -->
    <rename-dialog
      :object-id="objectId"
      :visible.sync="showRenameObjectDialog"
      :before-close="unlockObjectSelection"
      @closed="closeRenameDialog"/>

    <!-- Move Object Dialog -->
    <move-dialog
      :object-id="objectId"
      :visible.sync="showMoveObjectDialog"
      :before-close="unlockObjectSelection"
      @closed="closeMoveDialog"/>

    <form
      ref="fileForm"
      style="display: none">
      <input
        ref="fileInput"
        type="file"
        style="display: none"
        multiple
        @change="handleObjectChange">
    </form>

  </div>
</template>

<script type="text/babel">
import EventBus from '~/utils/event-bus.js'
import uploadObject from './uploadObject'
import downloadObject from './downloadObject'
import checkObjectsPermissions from './checkObjectsPermissions'
import moveDialog from './actions/moveDialog'
import renameDialog from './actions/renameDialog'
import createFolderDialog from './actions/createFolderDialog'

export default {
  components: {
    moveDialog,
    renameDialog,
    createFolderDialog
  },
  mixins: [
    uploadObject,
    downloadObject,
    checkObjectsPermissions
  ],

  data () {
    return {
      objectId: null,
      showRenameObjectDialog: false,
      showCreateFolderDialog: false,
      showMoveObjectDialog: false
    }
  },

  // Register and Remove event listeners
  created () {
    EventBus.$on('modules-files-objects--star-object', this.starObject)
    EventBus.$on('modules-files-objects--unstar-object', this.unstarObject)
    EventBus.$on('modules-files-objects--download-object', this.downloadObject)

    if (!this.canWrite) return

    EventBus.$on('modules-files-objects--rename-object', this.openRenameDialog)
    EventBus.$on('modules-files-objects--move-object', this.openMoveDialog)
    EventBus.$on('modules-files-objects--delete-object', this.deleteObject)
    EventBus.$on('modules-files-objects--create-folder', this.openCreateFolderDialog)
    EventBus.$on('modules-files-objects--upload-object', this.uploadObject)
    EventBus.$on('modules-files-objects--upload-object-dialog', this.openObjectsSelectDialog)
  },
  destroyed () {
    EventBus.$off('modules-files-objects--rename-object', this.openRenameDialog)
    EventBus.$off('modules-files-objects--move-object', this.openMoveDialog)
    EventBus.$off('modules-files-objects--delete-object', this.deleteObject)
    EventBus.$off('modules-files-objects--star-object', this.starObject)
    EventBus.$off('modules-files-objects--unstar-object', this.unstarObject)
    EventBus.$off('modules-files-objects--create-folder', this.openCreateFolderDialog)
    EventBus.$off('modules-files-objects--upload-object', this.uploadObject)
    EventBus.$off('modules-files-objects--download-object', this.downloadObject)
    EventBus.$on('modules-files-objects--upload-object-dialog', this.openObjectsSelectDialog)
  },

  methods: {
    lockObjectSelection () {
      EventBus.$emit('modules-files-objects--close-contextmenu')
      this.$store.dispatch('modules/files/index/LockObjectSelection', true)
    },
    unlockObjectSelection (done = () => {}) {
      done()
      this.$nextTick(() => {
        this.$store.dispatch('modules/files/index/LockObjectSelection', false)
      })
    },

    // Rename Object
    openRenameDialog (fileId) {
      this.lockObjectSelection()
      this.objectId = fileId

      this.showRenameObjectDialog = true
    },
    closeRenameDialog () {
      this.objectId = null
      this.showRenameObjectDialog = false
      this.unlockObjectSelection()
    },

    // Move Object
    openMoveDialog (fileId) {
      this.lockObjectSelection()
      this.objectId = fileId

      this.showMoveObjectDialog = true
    },
    closeMoveDialog () {
      this.objectId = null
      this.showMoveObjectDialog = false
      this.unlockObjectSelection()
    },

    // Create a Folder
    openCreateFolderDialog () {
      this.lockObjectSelection()
      this.objectId = this.$store.getters['modules/files/index/parent']

      this.showCreateFolderDialog = true
    },
    closeCreateFolderDialog () {
      this.objectId = null
      this.showCreateFolderDialog = false
      this.unlockObjectSelection()
    },

    // Star Object
    async starObject (fileId) {
      this.lockObjectSelection()
      let file = this.$store.getters['modules/files/index/object'](fileId)
      await this.$store.dispatch('modules/files/index/StarObject', file)
      this.unlockObjectSelection()
    },
    async unstarObject (fileId) {
      this.lockObjectSelection()
      let file = this.$store.getters['modules/files/index/object'](fileId)
      await this.$store.dispatch('modules/files/index/UnstarObject', file)
      this.unlockObjectSelection()
    },

    // Delete Object
    async deleteObject (selectedObjects) {
      this.lockObjectSelection()

      let text
      let files = selectedObjects.map(id => this.$store.getters['modules/files/index/object'](id))

      if (selectedObjects.length === 1) {
        text = files[0].kind === 'folder'
          ? this.$t('message.modules-files-objects-delete-folder')
          : this.$t('message.modules-files-objects-delete-file')
      } else {
        text = this.$t('message.modules-files-objects-delete-selected')
      }

      try {
        await this.$confirm(text, this.$t('general.warning'), {
          confirmButtonText: this.$t('general.yes'),
          cancelButtonText: this.$t('general.no'),
          type: 'warning'
        })

        for (let file of files) {
          this.$store.dispatch('modules/files/index/DeleteObject', file)
        }
      } catch (e) {}

      this.unlockObjectSelection()
    },

    openObjectsSelectDialog () {
      if (!this.$refs.fileInput) return
      // open the fileSelectionDialog
      this.$refs.fileInput.click()
    },

    // Fired then the openObjectDialog has a selected file
    handleObjectChange (event) {
      for (var i = 0; i < event.target.files.length; i++) {
        EventBus.$emit('modules-files-objects--upload-object', {file: event.target.files.item(i), parent: null})
      }
      this.$refs.fileForm.reset()
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
