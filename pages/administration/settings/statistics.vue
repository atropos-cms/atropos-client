<template lang="html">
  <div>

    <!-- Info boxes -->
    <el-card class="box-card">
      <storage-chart :value="stats"/>
    </el-card>

  </div>
</template>

<script type="text/babel">
import StorageChart from '~/components/administration/settings/storageChart'

export default {
  meta: {
    permission: 'administration-settings'
  },

  components: {
    StorageChart
  },

  async fetch ({store, params}) {
    await store.dispatch('administration/settings/GetSettings', {stats: true})
  },

  computed: {
    stats () {
      return this.$store.getters['administration/settings/get']('stats')
    }
  }
}
</script>
