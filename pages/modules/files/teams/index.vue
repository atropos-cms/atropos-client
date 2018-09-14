<template lang="html">
  <div>
    <header-toolbar />

    <el-table
      :default-sort="{prop: 'name', order: 'ascending'}"
      :data="teams"
      stripe>

      <el-table-column
        :label="$t('modules.files.teams.name')"
        sortable
        fixed
        property="name"
        min-width="200"/>
      <el-table-column
        :label="$t('modules.files.teams.updated_at')"
        property="updated_at"
        min-width="200"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | moment("from") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('modules.files.teams.storage-used')"
        property="updated_at"
        min-width="200"
        sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.storageUsed">{{ scope.row.storageUsed || 0 | filesize }}</div>
          <div v-else>-</div>
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
            @click="editTeam(scope.row)">

            {{ $t('general.edit') }}

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{command: 'edit', data: scope.row}">{{ $t('general.edit') }}</el-dropdown-item>
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
import HeaderToolbar from '~/components/modules/files/teams/headerToolbar'

export default {
  layout: 'boxed',

  meta: {
    sidebar: {
      active: 'modules-files'
    }
  },

  components: {
    HeaderToolbar
  },

  async fetch ({ store, params }) {
    await store.dispatch('modules/files/GetTeams')
  },

  computed: {
    teams () {
      return this.$store.getters['modules/files/teams']
    }
  },

  methods: {
    handleCommand ({ command, data }) {
      switch (command) {
        case 'edit':
          return this.editTeam(data)
        case 'delete':
          return this.deleteTeam(data)
      }
    },
    async editTeam (team) {
      this.$router.push({ name: 'modules-files-teams-id', params: { id: team.id } })
    },
    async deleteTeam (team) {
      await this.$confirm(this.$t('message.modules-files-teams-delete'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('modules/files/DeleteTeam', team)

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    }
  }
}
</script>
