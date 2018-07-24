<template lang="html">
  <app>
    <div class="container--empty">

      <page-header/>

      <div
        :class="{
          'main-wrapper': loggedIn,
          'guest-wrapper': !loggedIn
      }">
        <nuxt/>
      </div>

    </div>
  </app>
</template>

<script type="text/babel">
import App from './_app'
import PageHeader from './components/PageHeader'

export default {
  name: 'LayoutEmpty',

  middleware: ['authenticated', 'permission'],

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
