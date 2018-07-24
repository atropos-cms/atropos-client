<template>
  <div>

    <el-row
      v-if="role"
      :gutter="20">

      <el-col
        :md="8"
        :lg="6"
        :xl="4">
        <el-card
          :body-style="{ padding: '0px' }"
          class="box-card --box-has-margin-bottom">

          <el-menu
            :default-active="roleEditPage"
            @select="changePage">
            <el-menu-item index="users">
              <i class="material-icons">group</i>
              <span>{{ $t('administration.roles.users') }}</span>
            </el-menu-item>
            <el-menu-item index="permissions">
              <i class="material-icons">security</i>
              <span>{{ $t('administration.roles.permissions') }}</span>
            </el-menu-item>
          </el-menu>

        </el-card>

      </el-col>

      <el-col
        :md="16"
        :lg="18"
        :xl="20">
        <role-users
          v-show="roleEditPage === 'users'"
          :store-role="role"/>
        <role-permissions
          v-show="roleEditPage === 'permissions'"
          :store-role="role"/>
      </el-col>

    </el-row>

  </div>
</template>

<script type="text/babel">
import roleUsers from './-id-users'
import rolePermissions from './-id-permissions'

export default {
  components: {
    roleUsers,
    rolePermissions
  },

  async asyncData ({store, params}) {
    await store.dispatch('administration/roles/GetRoles')
    return {role: store.getters['administration/roles/get'](params.id)}
  },

  data () {
    return {
      role: null,
      roleEditPage: 'users'
    }
  },

  methods: {
    changePage (index) {
      this.roleEditPage = index
    }
  }
}
</script>
