<template lang="html">
  <el-card class="box-card">
    <div slot="header">
      <span>{{ $t(`administration.roles.permission-groups.${name}`) }}</span>
    </div>

    <slot/>
  </el-card>
</template>

<script type="text/babel">
export default {
  props: {
    name: {
      type: String,
      require: true,
      default: ''
    }
  },

  computed: {
    isSelected: {
      get () {
        return this.value.includes(this.toggle)
      },
      set (value) {
        if (value) {
          return this.$emit('input', [...this.value, this.toggle])
        }
        return this.$emit('input', this.value.filter(v => v !== this.toggle))
      }
    }
  }
}
</script>
