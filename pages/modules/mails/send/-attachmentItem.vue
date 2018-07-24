<template lang="html">
  <el-tag
    closable
    type="info"
    @close="removeAttachment">
    {{ attachment.name }}
  </el-tag>
</template>

<script type="text/babel">
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  computed: {
    attachment () {
      return this.$store.getters['modules/media/browser/file'](this.id)
    }
  },

  methods: {
    removeAttachment () {
      this.$emit('remove', this.id)
    }
  }
}
</script>
