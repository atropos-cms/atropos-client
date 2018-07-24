<template lang="html">
  <span
    :class="{'--is-drag-over-target': dragIsOverTarget}"
    class="modules-media-browser--upload-button"
    @drop.prevent="drop"
    @dragover.stop.prevent="dragover"
    @dragleave.self.prevent="dragleave">

    <el-button
      :disabled="disabled"
      type="text"
      @click="openFileDialog">
      <i class="material-icons el-button-icon">add</i>
      {{ $t('modules.media.button.add-attachment') }}
    </el-button>

    <el-progress
      v-if="showUploadProgress"
      :text-inside="true"
      :stroke-width="18"
      :percentage="progress.fileProgress"
      class="modules-media-browser--button-upload-progress"/>

    <div
      ref="fileForm"
      style="display: none">

      <input
        ref="fileInput"
        type="file"
        style="display: none"
        @change="handleFileChange">

    </div>

  </span>
</template>

<script type="text/babel">
import uploadMixin from './upload'
import dragDropHandler from './dragDropHandler'

export default {
  mixins: [dragDropHandler, uploadMixin],

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    maxUploadSize: {
      type: Number,
      default: 0,
      required: false
    }
  },

  data () {
    return {
      showMultipleDragMessage: false
    }
  },

  methods: {
    openFileDialog () {
      if (this.disabled) return
      this.$refs.fileInput.click()
    },

    // Fired then the openFileDialog has a selected file
    handleFileChange (event) {
      let filesList = Array.from(event.target.files)
      this.$refs.fileInput.value = ''

      for (let file of filesList) {
        if (this.isTooLarge(file.size)) {
          this.fileIsTooLarge()
          return
        }
      }

      this.uploadFiles(filesList)
    },

    selectedFile (files) {
      this.$emit('uploaded', files[0])
    },

    isTooLarge (size) {
      if (this.maxUploadSize === 0) return false

      return this.maxUploadSize < size
    },

    fileIsTooLarge () {
      this.$message({
        message: this.$t('message.upload-file-button--file-too-large', {size: this.$options.filters.filesize(this.maxUploadSize)}),
        type: 'warning'
      })
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
