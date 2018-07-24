<template lang="html">
  <div class="no-content--wrapper">

    <transition name="el-fade-in">

      <img
        v-if="illustration"
        :src="imgSrc"
        class="no-content--illustration"
        draggable="false">

    </transition>

    <transition name="el-fade-in">

      <div>
        <h3>{{ text }}</h3>
      </div>

    </transition>
  </div>
</template>

<script type="text/babel">
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    illustration: {
      type: String,
      default: null
    }
  },

  computed: {
    imgSrc () {
      return `/images/illustrations/${this.illustration}.svg`
    }
  }
}
</script>
