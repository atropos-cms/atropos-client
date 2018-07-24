<template lang="html">
  <div>
    <header-toolbar />

    <el-table
      :data="roles"
      :default-sort="{prop: 'full_name', order: 'ascending'}"
      stripe>
      <el-table-column
        :label="$t('administration.roles.name')"
        property="name"
        min-width="200"
        fixed
        sortable/>

      <el-table-column
        :label="$t('administration.roles.users')"
        property="members"
        min-width="200"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.members.length }}</span>
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
            @click="editRole(scope.row)">
            {{ $t('general.edit') }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{command: 'edit', data: scope.row}">
                {{ $t('general.edit') }}
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
import HeaderToolbar from '~/components/administration/roles/headerToolbar'

export default {
  layout: 'boxed',

  components: {
    HeaderToolbar
  },

  async fetch ({store, params}) {
    await store.dispatch('administration/roles/GetRoles', {force: true})
  },

  computed: {
    roles () {
      return this.$store.getters['administration/roles/list']
    }
  },

  methods: {
    handleCommand ({command, data}) {
      switch (command) {
        case 'edit':
          return this.editRole(data)
        case 'delete':
          return this.deleteRole(data)
      }
    },
    async editRole (role) {
      this.$router.push(`/administration/roles/${role.id}`)
    },
    async deleteRole (role) {
      await this.$confirm(this.$t('message.delete-role'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('administration/roles/DeleteRole', role)

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    }
  }
}
</script>
