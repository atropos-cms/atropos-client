<template lang="html">
  <div v-if="objectId && visible">

    <!-- Move Object Dialog -->
    <el-dialog
      :visible="visible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      class="modules-files-objects--move-dialog"
      @open="open"
      @close="close">

      <!-- Title -->
      <span slot="title">

        <el-button
          :disabled="!canGoBack"
          circle
          size="mini"
          class="--back-button"
          @click="backToParent">
          <i class="material-icons">chevron_left</i>
        </el-button>

        <span class="el-dialog__title">{{ $t('modules.files.files.move') }}</span>
      </span>

      <!-- Content -->

      <div>
        <template v-for="object in objects">
          <el-row
            :key="object.id"
            :gutter="20"
            :class="{'--selected': isSelected(object.id)}"
            align="middle"
            class="modules-files-objects--list-item"
            type="flex"
            @click.native="select(object.id)"
            @dblclick.native="open(object.id)">

            <el-col
              :span="22"
              class="--flex-align-center">
              <icon
                :class="{'text-placeholder': !isSelectable(object.id)}"
                :file="object"/>

              <span>
                <span
                  :class="{'text-placeholder': !isSelectable(object.id)}">
                  {{ object.name | truncate(50) }}
                </span>
              </span>
            </el-col>

            <el-col
              :span="2"
              class="--flex-align-center">
              <span
                v-if="isSelectable(object.id)"
                class="text-secondary --has-pointer-cursor"
                @click="open(object.id)">
                <i class="material-icons">chevron_right</i>
              </span>
            </el-col>

          </el-row>
        </template>
      </div>

      <!-- Footer -->
      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="cancel">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="ok">
          {{ okButtonText }}
        </el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import icon from '~/components/modules/files/objects/icon'
import dialogMixin from './dialogMixin'

export default {

  components: {
    icon
  },
  mixins: [dialogMixin],

  data () {
    return {
      parent: null,
      selected: null
    }
  },

  computed: {
    objects () {
      return this.$store.getters['modules/files/objects'](this.parent ? this.parent.id : null)
    },
    canGoBack () {
      return !!this.parent
    },
    okButtonText () {
      if (this.selected) {
        return this.$t('modules.files.files.move')
      }

      return this.$t('modules.files.files.move-here')
    }
  },

  methods: {
    async opened () {
      let file = this.$store.getters['modules/files/object'](this.objectId)
      let parent = await this.$store.dispatch('modules/files/GetObject', { id: file.parent_id })

      this.parent = parent
      this.selected = null

      await this.$store.dispatch('modules/files/GetObjects', { force: true, parent: this.parent })
    },

    async action () {
      this.loading = true

      // reset selection, since selected elemnt will no longer be in view
      this.$store.commit('modules/files/SET_SELECTED_OBJECTS', null)

      // call delete to remove the object from the local store
      this.$store.commit('modules/files/DELETE_OBJECT', this.objectCopy)

      // set the new parent
      if (this.selected) {
        this.objectCopy.parent_id = this.selected
      } else {
        this.objectCopy.parent_id = this.parent ? this.parent.id : null
      }

      // update object and persist
      await this.$store.dispatch('modules/files/UpdateObject', this.objectCopy)
      this.loading = false
    },

    select (objectId) {
      if (!this.isSelectable(objectId)) return

      if (this.isSelected(objectId)) {
        this.selected = null
        return
      }

      this.selected = objectId
    },

    async open (objectId) {
      if (!this.isSelectable(objectId)) return

      let parent = await this.$store.dispatch('modules/files/GetObject', { id: objectId })

      this.parent = parent
      this.selected = null

      await this.$store.dispatch('modules/files/GetObjects', { force: true, parent: objectId })
    },

    async backToParent () {
      await this.open(this.parent.parent_id)
    },

    isSelected (objectId) {
      return this.selected === objectId
    },
    isSelectable (objectId) {
      if (!objectId) return true
      if (this.objectId === objectId) return false

      let file = this.$store.getters['modules/files/object'](objectId)
      return file.kind === 'folder'
    }
  }
}
</script>
