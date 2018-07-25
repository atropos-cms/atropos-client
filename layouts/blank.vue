<template lang="html">
  <app>
    <div class="container--blank">
      <nuxt/>
    </div>
  </app>
</template>

<script type="text/babel">
import App from './_app'

export default {
  name: 'LayoutBlank',

  middleware: ['authenticated', 'permission', 'update-presence'],

  components: {
    App
  },

  computed: {
    loggedIn () {
      return this.$store.getters['profile/loggedIn']
    }
  }
}
</script>
