<template lang="html">
  <div>
    <el-switch
      :value="value"
      :inactive-text="$t('modules.files.teams.read-only')"
      :active-text="$t('modules.files.teams.read-write')"
      @input="input"/>
  </div>
</template>

<script type="text/babel">
export default {
  props: {
    value: {
      type: Boolean,
      require: true,
      default: false
    }
  },

  methods: {
    input (value) {
      this.$emit('input', value)
    }
  }
}
</script>
