<template lang="html">
  <span>
    <portal to="toolbar">
      <div
        class="modules-files-objects--toolbar-wrapper"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave">

        <!-- Selection-->
        <div
          v-if="hasSelected"
          class="page-header--toolbar-options-separated">

          <el-button
            v-if="oneSelected && isDownloadable"
            type="text"
            @click="download">
            <i class="material-icons">file_download</i>
          </el-button>

          <el-button
            v-if="canWrite"
            type="text"
            class="hidden-md-and-down"
            @click="trash">
            <i class="material-icons">delete</i>
          </el-button>

          <el-dropdown
            v-if="showMoreDropdown"
            @command="handleSelectionCommand">
            <el-button type="text">
              <i class="material-icons">more_vert</i>
            </el-button>
            <el-dropdown-menu slot="dropdown">

              <!-- <el-dropdown-item
                v-if="!allSelectedStared"
                class="el-dropdown-menu__item--icon"
                command="star">
                <i class="material-icons">star</i>
                <span>{{ $t('modules.files.files.star') }}</span>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="allSelectedStared"
                class="el-dropdown-menu__item--icon"
                command="unstar">
                <i class="material-icons">star_border</i>
                <span>{{ $t('modules.files.files.unstar') }}</span>
              </el-dropdown-item> -->

              <el-dropdown-item
                v-if="oneSelected && canWrite"
                class="el-dropdown-menu__item--icon"
                command="rename">
                <i class="material-icons">create</i>
                <span>{{ $t('modules.files.files.rename') }}</span>
              </el-dropdown-item>

              <el-dropdown-item
                v-if="oneSelected && canWrite"
                class="el-dropdown-menu__item--icon"
                command="move">
                <i class="material-icons">forward</i>
                <span>{{ $t('modules.files.files.move') }}</span>
              </el-dropdown-item>

              <div
                v-if="oneSelected && canWrite"
                class="page-header--toolbar-options-dropdown --is-separated"/>

              <el-dropdown-item
                v-if="oneSelected && isDownloadable"
                class="el-dropdown-menu__item--icon"
                command="download">
                <i class="material-icons">file_download</i>
                <span>{{ $t('modules.files.files.download') }}</span>
              </el-dropdown-item>

              <div
                v-if="oneSelected && canWrite"
                class="page-header--toolbar-options-dropdown --is-separated"/>

              <el-dropdown-item
                v-if="canWrite"
                class="el-dropdown-menu__item--icon"
                command="trash">
                <i class="material-icons">delete</i>
                <span>{{ $t('modules.files.files.trash') }}</span>
              </el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>

        </div>

        <!-- View Mode-->
        <div
          :class="{'page-header--toolbar-options-separated': canWrite || $can('modules-files-teams')}"
          class="page-header--toolbar-options">

          <el-button
            v-if="view === 'grid'"
            type="text"
            @click="changeView('list')">
            <help-tooltip :content="$t('modules.files.files.list-view')">
              <i class="material-icons">view_list</i>
            </help-tooltip>
          </el-button>

          <el-button
            v-if="view === 'list'"
            type="text"
            @click="changeView('grid')">
            <help-tooltip :content="$t('modules.files.files.grid-view')">
              <i class="material-icons">view_module</i>
            </help-tooltip>
          </el-button>

          <el-button
            type="text"
            class="hidden-md-and-down"
            @click="showInfo">
            <help-tooltip :content="$t('modules.files.files.show-info')">
              <i class="material-icons">info</i>
            </help-tooltip>
          </el-button>

        </div>

        <div
          v-if="$can('modules-files-teams')"
          class="page-header--toolbar-options">

          <el-button
            v-if="$can('modules-files-teams')"
            type="text"
            @click="navigateToTeams">
            <help-tooltip :content="$t('modules.files.teams.manage')">
              <i class="material-icons">people_outline</i>
            </help-tooltip>
          </el-button>

        </div>

        <!-- New Button -->
        <el-dropdown
          v-if="canWrite"
          @command="handleNewCommand">
          <el-button type="primary">
            <span>{{ $t('general.add') }}</span>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="folder"
              class="el-dropdown-menu__item--icon">
              <i class="material-icons">create_new_folder</i>
              <span>{{ $t('modules.files.files.add-folder') }}</span>
            </el-dropdown-item>
            <el-dropdown-item
              command="upload"
              class="el-dropdown-menu__item--icon">
              <i class="material-icons">file_upload</i>
              <span>{{ $t('modules.files.files.upload-file') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </portal>

  </span>
</template>

<script type="text/babel">
import EventBus from '~/utils/event-bus.js'
import checkObjectsPermissions from './checkObjectsPermissions'
import selectionPropertiesMixin from './selectionPropertiesMixin'

export default {
  mixins: [checkObjectsPermissions, selectionPropertiesMixin],

  computed: {
    showMoreDropdown () {
      return this.canWrite
    },
    view () {
      return this.$store.getters['modules/files/view']
    }
  },

  methods: {
    mouseenter () {
      this.$store.dispatch('modules/files/LockObjectSelection', true)
    },
    mouseleave () {
      this.$store.dispatch('modules/files/LockObjectSelection', false)
    },
    changeView (view) {
      this.$store.dispatch('modules/files/ChangeView', view)
    },
    showInfo () {
      let info = this.$store.getters['modules/files/info']
      this.$store.dispatch('modules/files/ShowInfo', !info)
    },

    navigateToTeams () {
      this.$router.push({ name: 'modules-files-teams' })
    },

    // Selection Commands
    handleSelectionCommand (command) {
      switch (command) {
        case 'star':
          return this.star()
        case 'unstar':
          return this.unstar()
        case 'rename':
          return this.rename()
        case 'move':
          return this.move()
        case 'trash':
          return this.trash()
        case 'download':
          return this.download()
      }
    },
    star () {
      let selectedObjects = this.$store.getters['modules/files/selectedObjects']
      for (let selected of selectedObjects) {
        EventBus.$emit('modules-files-objects--star-object', selected)
      }
    },
    unstar () {
      let selectedObjects = this.$store.getters['modules/files/selectedObjects']
      for (let selected of selectedObjects) {
        EventBus.$emit('modules-files-objects--unstar-object', selected)
      }
    },
    rename () {
      let selected = this.$store.getters['modules/files/selectedObjects']
      if (!selected.length === 1) return
      EventBus.$emit('modules-files-objects--rename-object', selected[0])
    },
    move () {
      let selected = this.$store.getters['modules/files/selectedObjects']
      if (!selected.length === 1) return
      EventBus.$emit('modules-files-objects--move-object', selected[0])
    },
    trash () {
      let selectedObjects = this.$store.getters['modules/files/selectedObjects']
      EventBus.$emit('modules-files-objects--delete-object', selectedObjects)
    },
    download () {
      let selectedObjects = this.$store.getters['modules/files/selectedObjects']
      EventBus.$emit('modules-files-objects--download-object', selectedObjects)
    },

    // New Commands
    handleNewCommand (command) {
      switch (command) {
        case 'folder':
          return this.createFolder()
        case 'upload':
          return this.uploadObject()
      }
    },
    createFolder () {
      EventBus.$emit('modules-files-objects--create-folder')
    },
    uploadObject () {
      EventBus.$emit('modules-files-objects--upload-object-dialog')
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
