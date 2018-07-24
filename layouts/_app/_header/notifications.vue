<template lang="html">
  <div>
    <el-popover
      ref="notifications"
      placement="bottom"
      trigger="click"
      @show="show"
      @hide="hide">

      <p>{{ $t('header.tasks.no-notifications') }}</p>

    </el-popover>

    <!-- Button -->
    <el-badge
      :hidden="!hasNotifications"
      :value="200"
      :max="9"
      is-dot
      class="header--notifications-count">

      <el-button
        v-popover:notifications
        :class="{'is-focused': isOpen}"
        class="header--notifications"
        type="text">
        <i class="material-icons">notifications</i>
      </el-button>

    </el-badge>

  </div>
</template>

<script type="text/babel">
export default {
  data () {
    return {
      isOpen: false
    }
  },

  computed: {
    hasNotifications () {
      return false
    }
  },

  methods: {
    show () {
      this.isOpen = true
    },
    hide () {
      this.isOpen = false
    }
  }
}
</script>
