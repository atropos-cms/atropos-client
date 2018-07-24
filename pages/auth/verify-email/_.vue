<template>
  <div
    v-loading="true"
    element-loading-background="rgba(0, 0, 0, 0.0)"/>
</template>

<script type="text/babel">
export default {
  meta: {
    permission: 'login'
  },

  async mounted () {
    await this.setEmailAddressVerified()
  },

  methods: {
    async setEmailAddressVerified () {
      try {
        await this.$store.dispatch('profile/VerifyEmail', this.$route.params[0])
      } catch (e) {
        this.$message({
          message: this.$t('errors.verify-email-token-invalid'),
          type: 'error',
          duration: 3 * 1000
        })
      }

      await this.$store.dispatch('profile/GetProfile', {force: true})

      this.$router.replace({name: 'index'})
    }
  }
}
</script>
