<template lang="html">

  <!-- Media Browser Dialog -->
  <el-dialog
    :title="$t('modules.media.browser.title')"
    :visible.sync="showMediaBrowserDialog"
    :close-on-click-modal="false"
    top="50px"
    class="modules-media-browser--dialog">

    <el-tabs v-model="activeTab">
      <el-tab-pane
        :label="$t('modules.media.browser.upload')"
        name="upload">

        <div
          :class="{'--is-drag-over-target': dragIsOverTarget}"
          class="modules-media-browser--upload-drag-drop"
          @drop.prevent="drop"
          @dragover.stop.prevent="dragover"
          @dragleave.self.prevent="dragleave">

          <el-alert
            v-if="showMultipleDragMessage"
            :title="$t('message.modules-media-browser-no-multiple-title')"
            :description="$t('message.modules-media-browser-no-multiple-message')"
            class="modules-media-browser--no-multiple-message"
            type="info"
            show-icon
            @close="showMultipleDragMessage=false"/>

          <el-alert
            v-if="showTypeNotSupportedMessage"
            :title="$t('message.modules-media-browser-type-not-supported-title')"
            :description="$t('message.modules-media-browser-type-not-supported-message')"
            class="modules-media-browser--type-not-supported-message"
            type="info"
            show-icon
            @close="showTypeNotSupportedMessage=false"/>

          <div class="modules-media-browser--upload-container">

            <upload-progress
              :show-upload-progress="showUploadProgress"
              :progress="progress"/>

            <!-- File chooser -->
            <div
              v-if="!showUploadProgress"
              class="modules-media-browser--upload-ready">

              <h3
                v-if="options.multiple"
                class="modules-media-browser--drag-drop-text" >
                {{ $t('message.drag-multiple-photos-here') }}
              </h3>
              <h3
                v-else
                class="modules-media-browser--drag-drop-text">{{ $t('message.drag-a-photo-here') }}</h3>

              <span class="text-secondary">{{ $t('message.or-if-you-prefere') }}</span>
              <el-button
                type="primary"
                size="small"
                plain
                @click="openFileDialog">
                {{ $t('modules.media.browser.select-file') }}
              </el-button>

            </div>

            <form
              ref="fileForm"
              style="display: none">
              <input
                ref="fileInput"
                :multiple="options.multiple"
                type="file"
                style="display: none"
                accept="image/*"
                @change="handleFileChange">
            </form>
          </div>
        </div>

      </el-tab-pane>

      <!-- Gallery Tab -->
      <el-tab-pane
        :label="$t('modules.media.browser.gallery')"
        name="gallery">

        <div
          v-if="activeTab === 'gallery'"
          class="modules-media-browser--list">

          <template v-for="(files, date, index) in fileGroup">
            <div :key="index">
              <span class="text-secondary">{{ date }}</span>
              <el-row
                :gutter="20"
                type="flex">

                <el-col
                  v-for="file in files"
                  :key="file.id"
                  :xs="12"
                  :sm="8"
                  :md="6"
                  :lg="6"
                  :xl="4">

                  <browser-file
                    :file="file"
                    :disabled-files="options.disabled"
                    :selected-files="selectedFiles"
                    @selected="selectedFileFromBrowser"/>

                </el-col>
              </el-row>
            </div>
          </template>
        </div>

        <div
          v-if="options.multiple"
          class="modules-media-browser--list-footer"
          @click="selectMultipleFiles">

          <el-button type="primary">
            {{ $t('general.ok') }}
          </el-button>

        </div>

      </el-tab-pane>
    </el-tabs>

  </el-dialog>

</template>

<script type="text/babel">
import Vue from 'vue'
import _ from 'lodash'
import moment from 'moment'
import EventBus from '~/utils/event-bus.js'
import uploadMixin from './upload'
import browserFile from './browser-file'
import uploadProgress from './uploadProgress'
import dragDropHandler from './dragDropHandler'

Vue.prototype.$mediaBrowser = (options = {}) => {
  return new Promise(function (resolve, reject) {
    EventBus.$emit('modules-media-browser-open', options)
    EventBus.$on('modules-media-browser-selected', resolve)
  })
}

const defaultOptions = {
  multiple: false,
  disabled: []
}

export default {
  components: {
    browserFile,
    uploadProgress
  },

  mixins: [dragDropHandler, uploadMixin],

  data () {
    return {
      options: {},
      activeTab: 'upload',
      showMediaBrowserDialog: false,
      showMultipleDragMessage: false,
      showTypeNotSupportedMessage: false,
      uploadedFilesAreBrowsable: true,
      selectedFiles: []
    }
  },

  computed: {
    files () {
      return this.$store.getters['modules/media/browser/files']
    },
    fileGroup () {
      // Order files by date
      let ordered = _.orderBy(this.files, file => {
        if (file.exif && file.exif.CreateDate) {
          return file.exif.CreateDate
        }
        return file.created_at
      }, ['desc'])

      // build groups for the same date
      return _.groupBy(ordered, file => {
        if (file.exif && file.exif.CreateDate) {
          return moment(file.exif.CreateDate).format('LL')
        }

        return moment(file.created_at).format('LL')
      })
    }
  },

  // Register and Remove event listeners
  created () {
    EventBus.$on('modules-media-browser-open', this.openMediaBrowser)
  },
  destroyed () {
    document.removeEventListener('dragover', this.dragleave)
    EventBus.$off('modules-media-browser-open', this.openMediaBrowser)
  },

  methods: {
    // Rename File
    openMediaBrowser (options = {}) {
      this.options = { ...defaultOptions, ...options }
      this.showMediaBrowserDialog = true

      // load files from the server
      this.$store.dispatch('modules/media/browser/GetFiles')
    },
    closeMediaBrowser () {
      this.selectedFiles = []
      this.showMediaBrowserDialog = false
      this.showMultipleDragMessage = false
      EventBus.$emit('modules-media-browser-colsed')
    },

    openFileDialog () {
      this.$refs.fileInput.click()
    },

    // Fired when the openFileDialog has a selected file
    handleFileChange (event) {
      let filesList = Array.from(event.target.files)

      for (let file of filesList) {
        if (!this.isImage(file.type)) {
          this.fileTypeNotSupported()
          return
        }
      }

      this.uploadFiles(filesList)
      this.$refs.fileForm.reset()
    },

    selectedFileFromBrowser (file) {
      if (this.options.multiple) {
        let selectedFileIndex = this.selectedFiles.findIndex(s => s.id === file.id)
        if (selectedFileIndex >= 0) {
          this.selectedFiles.splice(selectedFileIndex, 1)
        } else {
          this.selectedFiles.push(file)
        }
      } else {
        EventBus.$emit('modules-media-browser-selected', file)
        this.closeMediaBrowser()
      }
    },

    selectedFile (files) {
      if (this.options.multiple) {
        EventBus.$emit('modules-media-browser-selected', _.orderBy(files, ['name'], ['asc']))
      } else {
        EventBus.$emit('modules-media-browser-selected', files[0])
      }

      this.closeMediaBrowser()
    },

    selectMultipleFiles () {
      EventBus.$emit('modules-media-browser-selected', this.selectedFiles)
      this.closeMediaBrowser()
    },

    multipleFilesNotSupported () {
      this.showMultipleDragMessage = true

      setTimeout(() => {
        this.showMultipleDragMessage = false
      }, 8000)
    },

    supportsFileType (type) {
      return this.isImage(type)
    },

    supportsAmount (length) {
      if (this.options.multiple) return true
      return length <= 1
    },

    isImage (mimeType) {
      return mimeType.match(/image\/.*/)
    },

    fileTypeNotSupported () {
      this.showTypeNotSupportedMessage = true

      setTimeout(() => {
        this.showTypeNotSupportedMessage = false
      }, 8000)
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
