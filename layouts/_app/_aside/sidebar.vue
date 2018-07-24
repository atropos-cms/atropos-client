<template lang="html">

  <el-menu
    :collapse="isCollapsed"
    :default-active="defaultActive"
    :default-openeds="defaultOpeneds"
    router
    unique-opened
    class="sidebar"
    @open="openSubmenu"
    @close="closeSubmenu">
    <template v-for="(item, index) in sidebar">
      <component
        :is="item.type"
        :item="item"
        :key="index"/>
    </template>
  </el-menu>

</template>

<script type="text/babel">
import { mapActions, mapGetters } from 'vuex'
import renderSidebarItem from './renderSidebarItem'

export default {
  mixins: [renderSidebarItem],

  computed: {
    ...mapGetters({
      loggedIn: 'profile/loggedIn',
      sidebar: 'ui/sidebar',
      isCollapsed: 'ui/sidebarIsCollapsed',
      defaultOpeneds: 'ui/sidebarOpenSubmenu',
      routeMeta: 'routeMeta'
    }),
    defaultActive () {
      if (this.routeMeta && this.routeMeta.sidebar) {
        return this.routeMeta.sidebar.active
      }

      let parameterString = Object.keys(this.$route.params).join('-')
      return this.$route.name && this.$route.name.replace(new RegExp(`-${parameterString}$`, 'g'), '')
    }
  },
  methods: {
    ...mapActions({
      closeSubmenu: 'ui/closeSubmenu',
      openSubmenu: 'ui/openSubmenu'
    })
  }
}
</script>
