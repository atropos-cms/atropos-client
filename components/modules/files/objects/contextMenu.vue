<template lang="html">
  <div
    :style="{'top': top, 'left': left}"
    class="modules-files-objects--context-menu">
    <el-menu
      ref="ctxMenu"
      mode="horizontal">

      <el-submenu
        ref="ctxMenuSubmenu"
        :hide-timeout="6000"
        popper-class="modules-files-objects--context-menu-popper"
        index="contextMenu">

        <!-- Nothing selected -->
        <el-menu-item
          v-if="showNewFolder"
          index="0-1"
          @click="createFolder">
          <i class="material-icons">create_new_folder</i>
          <span>{{ $t('modules.files.files.add-folder') }}</span>
        </el-menu-item>

        <el-menu-item
          v-if="showUpload"
          index="0-2"
          @click="uploadObject">
          <i class="material-icons">file_upload</i>
          <span>{{ $t('modules.files.files.upload-file') }}</span>
        </el-menu-item>

        <!-- Object/Folder is selected -->
        <!-- <el-menu-item
          v-if="hasSelected && !allSelectedStared"
          index="0-3"
          @click="star">
          <i class="material-icons">star</i>
          <span>{{ $t('modules.files.files.star') }}</span>
        </el-menu-item>
        <el-menu-item
          v-if="hasSelected && allSelectedStared"
          index="0-4"
          @click="unstar">
          <i class="material-icons">star_border</i>
          <span>{{ $t('modules.files.files.unstar') }}</span>
        </el-menu-item> -->

        <el-menu-item
          v-if="showRename"
          index="0-5"
          @click="rename">
          <i class="material-icons">create</i>
          <span>{{ $t('modules.files.files.rename') }}</span>
        </el-menu-item>

        <el-menu-item
          v-if="showMove"
          index="0-6"
          @click="move">
          <i class="material-icons">forward</i>
          <span>{{ $t('modules.files.files.move') }}</span>
        </el-menu-item>

        <div
          v-if="showSeparator1"
          class="--is-separated"/>

        <el-menu-item
          v-if="showInfo"
          index="0-7"
          class="hidden-md-and-down"
          @click="openInfo">
          <i class="material-icons">info</i>
          <span>{{ $t('modules.files.files.show-info') }}</span>
        </el-menu-item>

        <el-menu-item
          v-if="showDownload"
          index="0-8"
          @click="download">
          <i class="material-icons">file_download</i>
          <span>{{ $t('modules.files.files.download') }}</span>
        </el-menu-item>

        <div
          v-if="showSeparator2"
          class="--is-separated"/>

        <el-menu-item
          v-if="showDelete"
          index="0-9"
          @click="trash">
          <i class="material-icons">delete</i>
          <span>{{ $t('modules.files.files.trash') }}</span>
        </el-menu-item>

      </el-submenu>

    </el-menu>
  </div>
</template>

<script type="text/babel">
import EventBus from '~/utils/event-bus.js'
import checkObjectsPermissions from './checkObjectsPermissions'
import selectionPropertiesMixin from './selectionPropertiesMixin'

export default {
  mixins: [checkObjectsPermissions, selectionPropertiesMixin],

  data () {
    return {
      top: '0px',
      left: '0px',
      contextForSelected: null
    }
  },

  computed: {
    info () {
      return this.$store.getters['modules/files/index/info']
    },
    showNewFolder () {
      return !this.hasSelected && this.canWrite
    },
    showUpload () {
      return !this.hasSelected && this.canWrite
    },
    showRename () {
      return this.oneSelected && this.canWrite
    },
    showMove () {
      return this.oneSelected && this.canWrite
    },
    showInfo () {
      return this.oneSelected && !this.info
    },
    showDownload () {
      return this.oneSelected && this.isDownloadable
    },
    showDelete () {
      return this.hasSelected && this.canWrite
    },
    showSeparator1 () {
      return (this.showNewFolder || this.showUpload || this.showCreate || this.showMove) && (this.showInfo || this.showDownload || this.showDelete)
    },
    showSeparator2 () {
      return (this.showInfo || this.showDownload) && (this.showDelete)
    },
    showContextMenu () {
      return (this.showNewFolder || this.showUpload || this.showCreate || this.showMove || this.showInfo || this.showDownload || this.showDelete)
    }
  },

  // Register and Remove event listeners
  created () {
    EventBus.$on('modules-files-objects--open-contextmenu', this.openContextMenu)
    EventBus.$on(
      'modules-files-objects--close-contextmenu',
      this.closeContextMenu
    )
  },
  destroyed () {
    EventBus.$off(
      'modules-files-objects--open-contextmenu',
      this.openContextMenu
    )
    EventBus.$on(
      'modules-files-objects--close-contextmenu',
      this.closeContextMenu
    )
  },

  methods: {
    openContextMenu (event) {
      // this.closeContextMenu()
      if (!this.$refs.ctxMenu) return
      if (!this.showContextMenu) return

      this.top = `${event.clientY - 5}px`
      this.left = `${event.clientX - 5}px`

      this.$nextTick(() => {
        this.$refs.ctxMenu.open('contextMenu')

        this.$nextTick(() => {
          this.$nextTick(() => {
            this.$refs.ctxMenuSubmenu.$refs.menu.style.top = this.top
            this.$refs.ctxMenuSubmenu.$refs.menu.style.left = this.left
          })
        })

        setTimeout(() => {
          this.$refs.ctxMenuSubmenu.$refs.menu.style.top = this.top
          this.$refs.ctxMenuSubmenu.$refs.menu.style.left = this.left
        }, 10)
      })
    },
    closeContextMenu () {
      if (!this.$refs.ctxMenu) return
      this.$refs.ctxMenu.close('contextMenu')
    },

    star () {
      let selectedObjects = this.$store.getters['modules/files/index/selectedObjects']
      for (let selected of selectedObjects) {
        EventBus.$emit('modules-files-objects--star-object', selected)
      }
      this.closeContextMenu()
    },
    unstar () {
      let selectedObjects = this.$store.getters['modules/files/index/selectedObjects']
      for (let selected of selectedObjects) {
        EventBus.$emit('modules-files-objects--unstar-object', selected)
      }
      this.closeContextMenu()
    },
    rename () {
      let selected = this.$store.getters['modules/files/index/selectedObjects']
      if (!selected.length === 1) return
      EventBus.$emit('modules-files-objects--rename-object', selected[0])
      this.closeContextMenu()
    },
    move () {
      let selected = this.$store.getters['modules/files/index/selectedObjects']
      if (!selected.length === 1) return
      EventBus.$emit('modules-files-objects--move-object', selected[0])
      this.closeContextMenu()
    },
    trash () {
      let selectedObjects = this.$store.getters['modules/files/index/selectedObjects']
      EventBus.$emit('modules-files-objects--delete-object', selectedObjects)
      this.closeContextMenu()
    },
    openInfo () {
      let info = this.$store.getters['modules/files/index/info']
      this.$store.dispatch('modules/files/index/ShowInfo', !info)
    },
    download () {
      let selectedObjects = this.$store.getters['modules/files/index/selectedObjects']
      EventBus.$emit('modules-files-objects--download-object', selectedObjects)
      this.closeContextMenu()
    },
    createFolder () {
      this.closeContextMenu()
      EventBus.$emit('modules-files-objects--create-folder')
    },
    uploadObject () {
      this.closeContextMenu()
      EventBus.$emit('modules-files-objects--upload-object-dialog')
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
