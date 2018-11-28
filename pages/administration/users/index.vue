<template lang="html">
  <div>
    <header-toolbar />

    <el-table
      :data="users"
      :default-sort="{prop: 'full_name', order: 'ascending'}"
      max-height="750"
      stripe>

      <el-table-column
        :label="$t('administration.user.full_name')"
        min-width="200"
        property="full_name"
        fixed
        sortable>
        <template slot-scope="scope">
          <user-avatar :id="scope.row.id"/>
          <span style="margin-left: 0.5em;">{{ scope.row.full_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('administration.user.email')"
        property="email"
        min-width="220"
        sortable>
        <template slot-scope="scope">
          <span :class="{'text-danger': scope.row.account_status == 'pending'}">{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('administration.user.last_action')"
        :sort-method="sortByLastAction"
        property="last_action"
        min-width="200"
        sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.last_action">{{ scope.row.last_action | moment("from") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('administration.user.activated')"
        property="activated"
        min-width="200"
        sortable>
        <template slot-scope="scope">
          <i
            v-if="scope.row.activated"
            class="material-icons">check</i>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        width="180"
        align="right">
        <template slot-scope="scope">
          <el-dropdown
            size="medium"
            type="primary"
            split-button
            @command="handleCommand"
            @click="editUser(scope.row)">
            {{ $t('general.edit') }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{command: 'edit', data: scope.row}">
                {{ $t('general.edit') }}
              </el-dropdown-item>
              <el-dropdown-item :command="{command: 'toggleActivate', data: scope.row}">
                <template v-if="!scope.row.activated">{{ $t('administration.user.activate') }}</template>
                <template v-if="scope.row.activated">{{ $t('administration.user.deactivate') }}</template>
              </el-dropdown-item>
              <el-dropdown-item
                :command="{command: 'delete', data: scope.row}"
                divided>
                {{ $t('general.delete') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script type="text/babel">
import userAvatar from '~/components/userAvatar'
import HeaderToolbar from '~/components/administration/users/headerToolbar'

export default {
  layout: 'boxed',

  components: {
    userAvatar,
    HeaderToolbar
  },

  async fetch ({ store, params }) {
    await store.dispatch('administration/users/GetUsers')
  },

  computed: {
    users () {
      return this.$store.getters['administration/users/list']
    }
  },

  methods: {
    handleCommand ({ command, data }) {
      switch (command) {
        case 'edit':
          return this.editUser(data)
        case 'toggleActivate':
          return this.toggleActivateUser(data)
        case 'delete':
          return this.deleteUser(data)
      }
    },

    async editUser (user) {
      this.$router.push(`/administration/users/${user.id}`)
    },

    async toggleActivateUser (user) {
      this.$store.dispatch('administration/users/UpdateUser', { ...user, activated: !user.activated })
    },

    async deleteUser (user) {
      await this.$confirm(this.$t('message.delete-user'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('administration/users/DeleteUser', user)

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    },

    sortByLastAction (a, b) {
      if (a.last_action === b.last_action) return 0
      if (a.last_action === null) return 1
      if (b.last_action === null) return -1
      return a.last_action < b.last_action ? 1 : -1
    }
  }
}
</script>
