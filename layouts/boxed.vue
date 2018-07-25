<template lang="html">
  <app>
    <div class="container--boxed">

      <page-header/>

      <div :class="{'main-wrapper': loggedIn}">
        <nuxt/>
      </div>

    </div>
  </app>
</template>

<script type="text/babel">
import App from './_app'
import PageHeader from './components/PageHeader'

export default {
  name: 'LayoutDefault',

  middleware: ['authenticated', 'permission', 'update-presence'],

  components: {
    App,
    PageHeader
  },

  computed: {
    loggedIn () {
      return this.$store.getters['profile/loggedIn']
    }
  }
}
</script>
