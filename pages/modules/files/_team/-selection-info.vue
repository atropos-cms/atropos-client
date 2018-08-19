<template lang="html">
  <el-card
    class="modules-files-objects--selection-info"
    @mouseenter.native="mouseenter"
    @mouseleave.native="mouseleave">

    <template v-if="!hasSelection">

      <div class="modules-files-objects--no-selection-info text-secondary">
        <i class="material-icons">find_in_page</i>
        <span>{{ $t('modules.files.files.select-object-to-view-info') }}</span>
      </div>

    </template>

    <template v-if="hasSelection">
      <div class="modules-files-objects--has-selection-info">

        <h5 class="--file-name">
          <icon :file="selection"/>
          <span>{{ selection.name }}</span>
        </h5>

        <el-collapse
          v-model="activeNames">

          <el-collapse-transition>
            <el-collapse-item
              v-if="hasPreview"
              :title="$t('modules.files.files.preview')"
              name="preview">

              <div class="modules-files-objects--info-preview">
                <transition
                  name="el-fade-in"
                  mode="out-in">
                  <img
                    v-if="previewSrc"
                    :src="previewSrc"
                    draggable="false">
                </transition>
              </div>

            </el-collapse-item>
          </el-collapse-transition>

          <el-collapse-item
            :title="$t('modules.files.files.info')"
            name="info">

            <!-- Type -->
            <div class="modules-files-objects--info-row">
              <div class="modules-files-objects--info-title">
                {{ $t('modules.files.files.kind') }}
              </div>
              <div class="modules-files-objects--info-content">
                <span>{{ fileType }}</span>
              </div>
            </div>

            <!-- Owner -->
            <div class="modules-files-objects--info-row">
              <div class="modules-files-objects--info-title">
                {{ $t('modules.files.files.owner') }}
              </div>
              <div class="modules-files-objects--info-content">
                <user :id="selection.owner_id"/>
              </div>
            </div>

            <!-- Size -->
            <div class="modules-files-objects--info-row">
              <div class="modules-files-objects--info-title">
                {{ $t('modules.files.files.file-size') }}
              </div>
              <div class="modules-files-objects--info-content">
                <span v-if="selection.size">{{ selection.size || 0 | filesize }}</span>
                <span v-else>-</span>
              </div>
            </div>

            <!-- Modified -->
            <div class="modules-files-objects--info-row">
              <div class="modules-files-objects--info-title">
                {{ $t('modules.files.files.update_at') }}
              </div>
              <div class="modules-files-objects--info-content">
                <span v-if="selection.modified_at">{{ selection.modified_at | moment("from") }}</span>
                <span v-else>-</span>
              </div>
            </div>

            <!-- Created -->
            <div class="modules-files-objects--info-row">
              <div class="modules-files-objects--info-title">
                {{ $t('modules.files.files.uploaded_at') }}
              </div>
              <div class="modules-files-objects--info-content">
                {{ selection.uploaded_at | moment("from") }}
              </div>
            </div>

          </el-collapse-item>
        </el-collapse>

      </div>
    </template>

  </el-card>
</template>

<script type="text/babel">
import User from '~/components/user'
import Icon from '~/components/modules/files/objects/icon'
import EventBus from '~/utils/event-bus.js'
import UsesFileMimetype from '~/mixins/usesFileMimetype'

export default {

  components: {
    Icon,
    User
  },
  mixins: [UsesFileMimetype],

  data () {
    return {
      activeNames: ['preview', 'info']
    }
  },

  computed: {
    selectionId () {
      let selection = this.$store.getters['modules/files/selectedObjects']
      return selection[selection.length - 1]
    },
    selection () {
      return this.$store.getters['modules/files/object'](this.selectionId)
    },
    hasSelection () {
      return !!this.selection
    },
    hasPreview () {
      if (!this.hasSelection) return false
      return this.selection.has_preview
    },
    previewSrc () {
      if (!this.hasPreview) return null
      return this.selection.preview
    },
    fileType () {
      if (this.selection.kind === 'folder') return this.$t('modules.files.files.folder')

      let type = this.nameFromMimetype(this.selection.mime_type)
      if (!type) return this.$t('modules.files.files.file')

      return this.$t(`mime-types.${type}`)
    }
  },

  watch: {
    hasPreview () {
      if (this.hasPreview && this.previewSrc) return
      this.fetchPreview({id: this.selectionId})
    }
  },

  // Register and Remove event listeners
  created () {
    EventBus.$on('modules-files-objects--select-object', this.fetchPreview)
  },
  destroyed () {
    EventBus.$off('modules-files-objects--select-object', this.fetchPreview)
  },

  mounted () {
    this.fetchPreview({id: this.selectionId})
  },

  methods: {
    async fetchPreview ({id}) {
      if (!this.selectionId) return
      if (id !== this.selectionId) return

      await this.$store.dispatch('modules/files/GetObject', {id: this.selectionId, preview: true})
    },
    mouseenter () {
      this.$store.dispatch('modules/files/LockObjectSelection', true)
    },
    mouseleave () {
      this.$store.dispatch('modules/files/LockObjectSelection', false)
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
