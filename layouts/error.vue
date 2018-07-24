<template>
  <div class="layout-error">

    <div class="left">
      <div class="error-text-container">
        <div class="error-oops">{{ $t('error-page.oops') }}</div>

        <div class="error-code">{{ error.statusCode }}</div>
        <div class="error-error">{{ $t('error-page.error') }}</div>

        <div class="error-message">{{ $t(error.message) }}</div>

        <el-button
          type="primary"
          round
          @click="backLink">
          {{ backButtonText }}
        </el-button>
      </div>
    </div>

    <div
      :class="errorClass"
      class="right"
    />

  </div>
</template>

<script>
export default {
  name: 'LayoutError',

  layout: 'blank',

  props: {
    error: {
      type: [Object, Error],
      required: true
    }
  },

  computed: {
    errorClass () {
      return `error-${this.error.statusCode}`
    },
    backButtonText () {
      if (this.error.statusCode === 503) {
        return this.$t('error-page.logout')
      }

      return this.$t('error-page.return-to-dashboard')
    }
  },

  methods: {
    backLink () {
      if (this.error.statusCode === 503) {
        return this.$router.replace({ name: 'auth-logout' })
      }

      return this.$router.replace({ name: 'index' })
    }
  }
}
</script>

<style scoped>
</style>
