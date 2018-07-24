<template lang="html">
  <span>

    <portal to="toolbar">
      <div
        class="modules-media-files--toolbar-wrapper">

        <!-- Selection-->
        <div
          v-if="hasSelected"
          class="page-header--toolbar-options-separated">

          <help-tooltip :content="$t('modules.media.files.clear-selection')">
            <el-button
              type="text"
              @click="clearSelection">
              <i class="material-icons">clear</i>
            </el-button>
          </help-tooltip>

          <help-tooltip :content="$t('modules.media.files.delete-selection')">
            <el-button
              type="text"
              @click="deleteSelection">
              <i class="material-icons">delete</i>
            </el-button>
          </help-tooltip>

        </div>

        <!-- General-->
        <div class="modules-media-files--toolbar-options">

          <el-button
            type="primary"
            @click="addFileToMedia">
            <span>{{ $t('general.add') }}</span>
          </el-button>

        </div>

      </div>
    </portal>

  </span>
</template>

<script type="text/babel">
export default {
  props: {
    selected: {
      type: null,
      default: null
    }
  },

  computed: {
    hasSelected () {
      return !!this.selected.length
    }
  },

  methods: {
    addFileToMedia () {
      this.$emit('add')
    },

    clearSelection () {
      this.$emit('clearSelection')
    },

    deleteSelection () {
      this.$emit('deleteSelection')
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
