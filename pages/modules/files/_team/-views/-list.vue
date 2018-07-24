<template lang="html">
  <div
    v-click-outside="deselect"
    class="modules-files-objects--list-wrapper">

    <el-card
      v-loading="isLoadingObjects"
      class="box-card modules-files-objects--list"
      @click.native="deselect"
      @contextmenu.native="contextMenu">

      <el-row
        :gutter="20"
        class="modules-files-objects--list-header"
        align="middle"
        type="flex">
        <el-col
          :span="18"
          :md="24"
          :lg="19"
          :xl="16">
          <span class="text-secondary">{{ $t('modules.files.files.name') }}</span>
        </el-col>
        <el-col
          :xl="5"
          class="hidden-lg-and-down">
          <span class="text-secondary">{{ $t('modules.files.files.update_at') }}</span>
        </el-col>
        <el-col
          :span="6"
          :lg="4"
          class="hidden-md-and-down">
          <span class="text-secondary">{{ $t('modules.files.files.file-size') }}</span>
        </el-col>
      </el-row>

      <template v-for="file in objects">
        <item
          :file="file"
          :key="file.id"/>
      </template>

    </el-card>

  </div>
</template>

<script type="text/babel">
import Item from './-listItem'
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
