<template lang="html">
  <div>
    <header-toolbar />

    <no-content
      v-if="!blocks.length"
      :text="$t('modules.content.blocks.no-blocks')"
      illustration="12"/>

    <el-row
      v-if="blocks.length"
      :gutter="20"
      align="middle"
      type="flex">

      <el-col
        :span="24"
        class="modules-content-blocks--list">

        <el-row
          :gutter="20"
          class="modules-content-blocks--list-header"
          align="middle"
          type="flex">

          <el-col
            :xs="3"
            :sm="3"
            :md="2"
            :lg="1"/>

          <el-col
            :xs="11"
            :sm="11"
            :md="8"
            :lg="9">
            <span class="text-secondary">{{ $t('modules.content.blocks.title') }}</span>
          </el-col>
          <el-col
            :xs="8"
            :sm="8"
            :md="6"
            :lg="6">
            <span class="text-secondary">{{ $t('modules.content.blocks.author') }}</span>
          </el-col>
          <el-col
            :span="6"
            class="hidden-sm-and-down">
            <span class="text-secondary">{{ $t('modules.content.blocks.update_at') }}</span>
          </el-col>
        </el-row>

        <blockListItem
          v-for="block in blocks"
          :key="block.id"
          :block="block"
        />

      </el-col>
    </el-row>
  </div>
</template>

<script type="text/babel">
import NoContent from '~/components/noContent'
import BlockListItem from './-index-blockListItem'
import HeaderToolbar from '~/components/modules/content/blocks/headerToolbar'

export default {
  components: {
    NoContent,
    BlockListItem,
    HeaderToolbar
  },

  async fetch ({ store }) {
    await store.dispatch('modules/content/blocks/GetBlocks')
  },

  computed: {
    blocks () {
      return this.$store.getters['modules/content/blocks/list']
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
