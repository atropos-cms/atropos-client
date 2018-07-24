<template lang="html">
  <el-card
    :body-style="{ padding: '0px' }"
    :class="{
      '--selected': isSelected,
      '--disabled': isDisabled
    }"
    class="box-card modules-media-browser-image">

    <img
      :src="imageUrl"
      draggable="false"
      style="display: block; width: 100%;"
      @click="select">

    <div class="selection-highlight">
      <i class="material-icons">check_circle</i>
    </div>

  </el-card>
</template>

<script type="text/babel">
export default {
  props: {
    file: {
      type: Object,
      required: true
    },
    disabledFiles: {
      type: Array,
      required: true,
      default: () => []
    },
    selectedFiles: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  computed: {
    imageUrl () {
      return this.file.s[300]
    },
    isDisabled () {
      return !!this.disabledFiles.find(s => s.id === this.file.id)
    },
    isSelected () {
      return !!this.selectedFiles.find(s => s.id === this.file.id)
    }
  },

  methods: {
    select () {
      if (this.isDisabled) return
      this.$emit('selected', this.file)
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
