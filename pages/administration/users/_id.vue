<template>
  <div>

    <el-row
      v-if="userId"
      :gutter="20">

      <el-col
        :md="8"
        :lg="6"
        :xl="4">
        <el-card
          :body-style="{ padding: '0px' }"
          class="box-card --box-has-margin-bottom">

          <el-menu
            :default-active="userEditPage"
            @select="changePage">
            <el-menu-item index="account">
              <i class="material-icons">face</i>
              <span>{{ $t('administration.user.account') }}</span>
            </el-menu-item>
            <el-menu-item index="roles">
              <i class="material-icons">group</i>
              <span>{{ $t('administration.user.roles') }}</span>
            </el-menu-item>
            <el-menu-item index="security">
              <i class="material-icons">lock</i>
              <span>{{ $t('administration.user.security') }}</span>
            </el-menu-item>
          </el-menu>

        </el-card>

      </el-col>

      <el-col
        :md="16"
        :lg="18"
        :xl="20">
        <user-account
          v-if="userEditPage === 'account'"
          :user-id="userId"/>
        <user-roles
          v-if="userEditPage === 'roles'"
          :user-id="userId"/>
        <user-security
          v-if="userEditPage === 'security'"
          :user-id="userId"/>
      </el-col>

    </el-row>

  </div>
</template>

<script type="text/babel">
import userAccount from './-id-account'
import userRoles from './-id-roles'
import userSecurity from './-id-security'

export default {
  components: {
    userAccount,
    userRoles,
    userSecurity
  },

  async fetch ({store}) {
    await store.dispatch('administration/users/GetUsers')
  },

  data () {
    return {
      userEditPage: 'account'
    }
  },

  computed: {
    userId () {
      return this.$route.params.id
    }
  },

  methods: {
    changePage (index) {
      this.userEditPage = index
    }
  }
}
</script>
