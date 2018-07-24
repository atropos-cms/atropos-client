<template lang="html">
  <div
    v-click-outside="deselect"
    class="modules-files-objects--grid-wrapper"
    @click="deselect"
    @contextmenu="contextMenu">

    <div v-if="folders.length">
      <div class="--object-type-description">{{ $t('modules.files.files.folders') }}</div>
    </div>
    <el-row
      :gutter="20"
      align="top"
      class="modules-files-objects--grid"
      type="flex">

      <template v-for="folder in folders">
        <item
          :file="folder"
          :key="folder.id"/>
      </template>
    </el-row>

    <div v-if="files.length">
      <div class="--object-type-description">{{ $t('modules.files.files.files') }}</div>
    </div>
    <el-row
      :gutter="20"
      align="top"
      class="modules-files-objects--grid"
      type="flex">

      <template v-for="file in files">
        <item
          :file="file"
          :key="file.id"/>
      </template>
    </el-row>

  </div>
</template>

<script type="text/babel">
import Item from './-gridItem'
import viewMixin from './viewMixin'

export default {
  components: {
    Item
  },

  mixins: [viewMixin]
}
</script>

<style type="text/css" scoped>
</style>
