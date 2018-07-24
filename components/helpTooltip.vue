<template lang="html">
  <el-tooltip
    :content="content"
    :enterable="false"
    :open-delay="1000"
    :placement="placement"
    popper-class="tooltip-not-enterable">

    <slot/>

  </el-tooltip>
</template>

<script type="text/babel">
export default {
  props: {
    content: {
      type: String,
      require: true,
      default: null
    },
    placement: {
      type: String,
      require: false,
      default: 'bottom'
    }
  }
}
</script>
