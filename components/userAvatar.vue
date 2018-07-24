<template lang="html">
  <span
    :class="[size]"
    class="user-avatar avatar border-white">

    <span
      v-if="loadingUser"
      :class="{'loading': loadingUser}"/>

    <template v-if="!loadingUser">
      <span>{{ initials }}</span>
    </template>

  </span>
</template>

<script type="text/babel">
export default {
  props: {
    id: {
      type: null,
      required: true,
      default: null
    },
    user: {
      type: Object,
      required: false,
      default: null
    },
    size: {
      type: String,
      default: 'small'
    }
  },

  computed: {
    userObject () {
      if (this.user) return this.user
      return this.$store.getters['administration/users/get'](this.id)
    },
    loadingUser () {
      return !this.userObject.id
    },
    initials () {
      let firstLetter = (this.userObject.first_name || '').substring(0, 1)
      let lastLetter = (this.userObject.last_name || '').substring(0, 1)

      return [firstLetter, lastLetter].join('')
    }
  },

  mounted () {
    this.$store.dispatch('administration/users/GetUser', this.id)
  }
}
</script>

<style type="text/css" scoped>
.loading {
  opacity: 0;
}
</style>
