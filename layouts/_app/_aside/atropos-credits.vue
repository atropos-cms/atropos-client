<template lang="html">
  <div class="atropos-credits">

    <el-tooltip
      :open-delay="1000"
      placement="top">

      <div slot="content">
        <table
          class="atropos-credits--app-status"
          style="width:100%"
          cellspacing="10">
          <tr>
            <th>{{ $t('app-status.status') }}</th>
            <td v-if="apiConnected">{{ $t('app-status.connected') }}</td>
            <td v-else>{{ $t('app-status.disconnected') }}</td>
          </tr>
          <tr>
            <th>{{ $t('app-status.api-version') }}</th>
            <td>{{ apiVersion }}</td>
          </tr>
          <tr>
            <th>{{ $t('app-status.ui-version') }}</th>
            <td>{{ uiVersion }}</td>
          </tr>
        </table>
      </div>

      <span>Powered by <a
        href="https://atropos-cms.org/"
        target="_blank"
        class="credits-link">Atropos</a></span>

    </el-tooltip>

  </div>
</template>

<script type="text/babel">
import displaysApiStatus from '~/mixins/displaysApiStatis.js'
const { version } = require('../../../package.json')

export default {
  mixins: [displaysApiStatus],

  computed: {
    apiMeta () {
      return this.$store.getters['apiMeta']
    },
    apiVersion () {
      if (!this.apiMeta) return
      return this.apiMeta.api
    },
    uiVersion () {
      return `${version}`
    },
    serviceWorkerStatus () {
      return this.$t('app-status.service-worker-not-installed')
    }
  }
}
</script>
