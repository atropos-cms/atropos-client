<template lang="html">
  <div>
    <header-toolbar />

    <el-table
      :default-sort="{prop: 'name', order: 'ascending'}"
      :data="lists"
      stripe>
      <el-table-column
        :label="$t('modules.mails.lists.name')"
        sortable
        property="name"
        fixed />
      <el-table-column
        :label="$t('modules.mails.lists.updated_at')"
        property="updated_at"
        sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | moment("from") }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="right"
        fixed="right">
        <template slot-scope="scope">
          <el-dropdown
            size="medium"
            type="primary"
            split-button
            @command="handleCommand"
            @click="editList(scope.row)">
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
import HeaderToolbar from '~/components/modules/mails/lists/headerToolbar'

export default {
  layout: 'boxed',

  meta: {
    sidebar: {
      active: 'modules-mails-send'
    }
  },

  components: {
    HeaderToolbar
  },

  async fetch ({store, params}) {
    await store.dispatch('modules/mails/lists/GetLists')
  },

  computed: {
    lists () {
      return this.$store.getters['modules/mails/lists/list']
    }
  },

  methods: {
    handleCommand ({command, data}) {
      switch (command) {
        case 'edit':
          return this.editList(data)
        case 'delete':
          return this.deleteList(data)
      }
    },
    async editList (team) {
      this.$router.push({ name: 'modules-mails-lists-id', params: {id: team.id} })
    },
    async deleteList (team) {
      await this.$confirm(this.$t('message.modules-mails-lists-delete'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('modules/mails/lists/DeleteList', team)

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    }
  }
}
</script>
