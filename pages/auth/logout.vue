<template lang="html">
  <div/>
</template>

<script type="text/babel">
export default {
  meta: {
    layout: {
      background: false
    },
    header: {
      title: 'auth.logout'
    },
    permission: null
  },

  mounted () {
    this.handleLogout()
  },

  methods: {
    async handleLogout () {
      const loading = this.$loading({
        lock: true,
        text: this.$t('auth.logout'),
        customClass: 'logout-loader'
      })

      try {
        await this.$store.dispatch('profile/LogOut')
      } catch (e) {}

      await this.$timeout(800)

      loading.close()
      location.reload()
    }
  }
}
</script>
