<template lang="html">
  <transition name="header">
    <el-header
      v-if="loggedIn"
      height="60px">

      <div class="header-left">

        <transition name="el-fade-in">
          <div
            v-show="headerShowSaveIndicator"
            class="header-save-indicator">
            <i class="el-icon-loading"/>
            <span class="saving-text">
              {{ $t('header.saving-ellipsis') }}
            </span>
          </div>
        </transition>

      </div>

      <div class="header-right">

        <!-- <notifications/> -->

        <el-dropdown
          v-if="profile"
          class="header--profile"
          @command="handleCommand">

          <span class="el-dropdown-link header--profile-dropdown">

            <user
              :id="profile.id"
              :user="profile"
              avatar/>

            <i class="el-icon-arrow-down el-icon--right"/>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="$can('profile')"
              class="el-dropdown-menu__item--icon"
              command="profile">
              <i class="material-icons">person</i>
              <span>{{ $t('header.profile') }}</span>
            </el-dropdown-item>

            <el-dropdown-item
              :divided="$can('profile')"
              class="el-dropdown-menu__item--icon"
              command="logout">
              <i class="material-icons">power_settings_new</i>
              <span>{{ $t('header.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>

        </el-dropdown>
      </div>

    </el-header>
  </transition>
</template>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Notifications from './_header/notifications'
import User from '~/components/user'

export default {
  name: 'DefaultHeader',

  components: {
    User,
    Notifications
  },

  computed: {
    ...mapGetters({
      loggedIn: 'profile/loggedIn',
      profile: 'profile/profile',
      headerShowSaveIndicator: 'ui/headerShowSaveIndicator'
    })
  },
  methods: {
    handleCommand (command) {
      switch (command) {
        case 'logout':
          return this.navigateLogout()
        case 'profile':
          return this.navigatePofile()
      }
    },
    navigateLogout () {
      this.$router.push({path: '/auth/logout'})
    },
    navigatePofile () {
      this.$router.push({path: '/profile'})
    }
  }
}
</script>
