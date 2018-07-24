<template lang="html">
  <transition name="aside">
    <el-aside
      v-if="loggedIn"
      :class="{'el-aside--collapsed': isCollapsed}"
      width="auto">

      <div class="aside-top-container">
        <div
          class="logo-wrapper"
          @click="toggleSidebarCollapsed">
          <logo :text="!isCollapsed"/>
        </div>

        <sidebar/>
      </div>

      <div
        v-if="!isCollapsed"
        class="aside-bottom-container">
        <atropos-credits/>
      </div>

    </el-aside>
  </transition>
</template>

<script type="text/babel">
import logo from '~/components/logo'
import sidebar from './_aside/sidebar'
import atroposCredits from './_aside/atropos-credits'

export default {
  name: 'DefaultAside',

  components: {
    atroposCredits,
    logo,
    sidebar
  },

  computed: {
    loggedIn () {
      return this.$store.getters['profile/loggedIn']
    },
    isCollapsed () {
      return this.$store.getters['ui/sidebarIsCollapsed']
    },
    logoText () {
      return this.isCollapsed ? 'A' : 'Atropos'
    }
  },
  methods: {
    toggleSidebarCollapsed () {
      this.$store.dispatch('ui/toggleSidebarCollapse')
    }
  }
}
</script>
