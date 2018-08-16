<template lang="html">
  <span>

    <template v-if="!loadingUser">
      <avatar
        v-if="avatar"
        :id="userObject.id"
        :user="user"
        class="avatar"/>

      <span>{{ userObject.full_name }}</span>
    </template>

  </span>
</template>

<script type="text/babel">
import avatar from './userAvatar'

export default {
  components: {
    avatar
  },

  props: {
    id: {
      type: String,
      required: true,
      default: null
    },
    user: {
      type: Object,
      required: false,
      default: null
    },
    avatar: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    userObject () {
      if (this.user) return this.user
      return this.$store.getters['administration/users/get'](this.id)
    },
    loadingUser () {
      return !this.userObject || !this.userObject.id
    }
  },

  async mounted () {
    return this.$apiWithoutErrorReporting(() => this.$store.dispatch('administration/users/GetUser', this.id))
  },

  watch: {
    id () {
      this.$store.dispatch('administration/users/GetUser', this.id)
    }
  }
}
</script>

<style type="text/css" scoped>
  .loading {
    opacity: 0;
  }
  .avatar {
    margin-right: 1em;
  }
</style>
