<template lang="html">
  <el-input
    ref="contentId"
    :value="value"
    :readonly="readonly">

    <el-tooltip
      ref="copyTooltip"
      slot="append"
      :content="$t('general.copied')"
      :manual="true"
      :hide-after="1500"
      class="item"
      effect="dark">

      <el-button
        size="mini"
        @click="copyText">
        <i class="material-icons">content_copy</i>
      </el-button>

    </el-tooltip>

  </el-input>
</template>

<script type="text/babel">
export default {
  props: {
    value: {
      type: String,
      require: true,
      default: null
    },
    readonly: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      disableTooltip: true
    }
  },

  methods: {
    async copyText () {
      this.$copyText(this.value)

      this.openTooltip()
      await this.$timeout(3000)
      this.closeTooltip()
    },

    openTooltip () {
      if (!this.$refs.copyTooltip) return
      this.$refs.copyTooltip.showPopper = true
    },
    closeTooltip () {
      if (!this.$refs.copyTooltip) return
      this.$refs.copyTooltip.showPopper = false
    }
  }
}
</script>
