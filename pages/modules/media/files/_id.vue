<template lang="html">
  <el-row
    :gutter="20"
    type="flex"
    class="--flex-wrap --flex-row">

    <el-col
      :md="14"
      :lg="18"
      class="--box-has-margin-bottom">
      <el-card class="box-card modules-media-files--item-preview">

        <img
          :src="imageUrl"
          draggable="false"
          class="modules-media-files--item-preview-image">

      </el-card>
    </el-col>

    <el-col
      :md="10"
      :lg="6"
      class="--box-has-margin-bottom">
      <el-card class="box-card">
        <el-collapse
          v-model="activeName"
          accordion>

          <el-collapse-item
            :title="$t('general.info')"
            name="info">

            <info :file="file"/>

          </el-collapse-item>

          <el-collapse-item
            :title="$t('general.danger-zone')"
            name="danger">

            <danger :file="file"/>

          </el-collapse-item>

        </el-collapse>
      </el-card>
    </el-col>

  </el-row>
</template>

<script type="text/babel">
import _ from 'lodash'
import Danger from './-id-danger'
import Info from './-id-info'

export default {
  components: {
    Danger,
    Info
  },

  async asyncData ({ store, params, redirect }) {
    let file = await store.dispatch('modules/media/browser/GetFile', params.id).catch(e => {})

    if (!file) redirect({ name: 'modules-media-files' })

    return {
      file: _.cloneDeep(file)
    }
  },

  data () {
    return {
      activeName: 'info',
      file: null
    }
  },

  computed: {
    imageUrl () {
      return this.file.r[1200] || this.file.download_url
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
