<template lang="html">
  <i
    v-if="isFile"
    class="material-icons modules-files-objects--file-icon">
    {{ icon }}
  </i>

  <i
    v-else-if="isFolder"
    class="material-icons modules-files-objects--folder-icon">
    folder
  </i>
</template>

<script type="text/babel">
import UsesFileMimetype from '~/mixins/usesFileMimetype'

export default {
  mixins: [UsesFileMimetype],

  props: {
    file: {
      type: Object,
      require: true,
      default () {
        return null
      }
    }
  },

  computed: {
    icon () {
      return this.iconFromMimetype(this.file.mime_type)
    },
    isFolder () {
      return this.file.kind === 'folder'
    },
    isFile () {
      return this.file.kind === 'file'
    }
  }
}
</script>
