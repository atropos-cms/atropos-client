<template lang="html">
  <div>

    <span
      v-if="loadingRole"
      :class="{'loading': loadingRole}">
      {{ $t('messages.loading-role') }}
    </span>

    <template v-if="!loadingRole">
      <span>{{ role.name }}</span>
    </template>

  </div>
</template>

<script type="text/babel">
export default {
  props: {
    id: {
      type: null,
      required: true,
      default: null
    }
  },

  computed: {
    role () {
      return this.$store.getters['administration/roles/get'](this.id)
    },
    loadingRole () {
      return !this.role.id
    }
  },

  mounted () {
    this.$store.dispatch('administration/roles/GetRole', this.id)
  }

}
</script>

<style type="text/css" scoped>
  .loading {
    opacity: 0;
  }
</style>
