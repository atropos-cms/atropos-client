<template lang="html">
  <div class="profile-container">

    <el-row :gutter="20">

      <el-col
        :md="8"
        :lg="6"
        :xl="4">
        <el-card
          :body-style="{ padding: '0px' }"
          class="box-card profile-card hidden-sm-and-down">

          <div class="profile-background"/>

          <div class="author">
            <user-avatar
              :id="profile.id"
              size="large"
            />
            <h3 class="title">{{ profile.full_name }}</h3>
            <div class="email">{{ profile.email }}</div>
          </div>
        </el-card>

        <el-card
          :body-style="{ padding: '0px' }"
          class="box-card profile-page-switch --box-has-margin-bottom" >

          <el-menu
            :default-active="profilePage"
            @select="changePage">
            <el-menu-item index="account">
              <i class="material-icons">face</i>
              <span>{{ $t('profile.account') }}</span>
            </el-menu-item>
            <el-menu-item index="security">
              <i class="material-icons">lock</i>
              <span>{{ $t('profile.security') }}</span>
            </el-menu-item>
          </el-menu>

        </el-card>

      </el-col>

      <el-col
        :md="16"
        :lg="18"
        :xl="20">
        <profile-account v-show="profilePage === 'account'"/>
        <profile-security v-show="profilePage === 'security'"/>
      </el-col>

    </el-row>

  </div>
</template>

<script type="text/babel">
import userAvatar from '~/components/userAvatar'
import profileAccount from './-index-account'
import profileSecurity from './-index-security'

export default {
  meta: {
    permission: 'profile'
  },

  components: {
    userAvatar,
    profileAccount,
    profileSecurity
  },

  data () {
    return {
      profilePage: 'account'
    }
  },

  computed: {
    profile () {
      return this.$store.getters['profile/profile']
    }
  },

  methods: {
    changePage (index) {
      this.profilePage = index
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
