<template>
  <img
    v-if="previewSrc"
    :src="previewSrc"
    draggable="false">
</template>

<script type="text/babel">
export default {
  props: {
    previewSrc: {
      type: String,
      require: false,
      default: null
    }
  }
}
</script>
