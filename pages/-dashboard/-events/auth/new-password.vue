<template lang="html">
  <div>

    <el-card class="no-content">
      <i class="material-icons text-regular">lock</i>
      <span>{{ $t('events.auth.new-password') }}</span>
    </el-card>

  </div>
</template>

<script type="text/babel">
import eventMixin from '../eventMixin.js'

export default {
  mixins: [eventMixin],

  props: {
    event: {
      type: Object,
      require: true,
      default: () => ({})
    }
  }
}
</script>
