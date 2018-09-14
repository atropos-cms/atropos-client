<template lang="html">
  <el-card class="box-card">
    <div slot="header">
      <span>{{ $t('modules.files.teams.roles') }}</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        @click="openModal">
        {{ $t('modules.files.teams.add-roles') }}
      </el-button>
    </div>

    <el-table
      :show-header="false"
      :default-sort="{prop: 'name', order: 'ascending'}"
      :data="team.roles"
      stripe>

      <el-table-column
        :label="$t('modules.files.teams.name')"
        min-width="200"
        property="id">
        <template slot-scope="scope">
          <role :id="scope.row.id"/>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('modules.files.teams.permission')"
        property="id"
        min-width="250"
        align="right">
        <template slot-scope="scope">
          <member-manage-toggle v-model="scope.row.manage"/>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('general.remove')"
        property="id"
        fixed="right"
        width="80">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="removeRole(scope.row.id)">
            <span><i class="material-icons">delete</i></span>
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      :title="$t('modules.files.teams.add-roles')"
      :visible.sync="dialogAddRoleVisible">

      <el-form
        ref="form"
        :model="newRole"
        :rules="rules"
        label-position="top"
        label-width="100px">

        <el-form-item
          :label="$t('modules.files.teams.role')"
          prop="id"
          style="padding-bottom: 1em">
          <role-select
            v-model="newRole.id"
            :disabled-roles="team.roles"
            size="large"/>
        </el-form-item>

        <el-form-item label="Manage">
          <member-manage-toggle v-model="newRole.manage"/>
        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeModal">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          type="primary"
          @click="addNewRole">
          {{ $t('general.ok') }}
        </el-button>

      </span>

    </el-dialog>

  </el-card>
</template>

<script type="text/babel">
import Role from '~/components/role'
import roleSelect from '~/components/roleSelect'
import memberManageToggle from '~/components/modules/files/teams/memberManageToggle'

export default {
  components: {
    Role,
    roleSelect,
    memberManageToggle
  },

  props: {
    team: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      dialogAddRoleVisible: false,
      newRole: {
        id: null,
        manage: false
      },
      rules: {
        id: [
          { required: true, trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    async openModal () {
      this.dialogAddRoleVisible = true

      let roles = await this.$store.dispatch('administration/roles/GetRoles')

      let firstRole = roles[0]
      if (!firstRole) return

      this.newRole.id = firstRole.id
    },

    async closeModal () {
      this.dialogAddRoleVisible = false

      this.newRole = {
        id: null,
        manage: false
      }
    },

    addNewRole () {
      let roles = this.team.roles
      roles.splice(1, 0, this.newRole)

      this.$emit('update:team', { ...this.team, roles: roles })

      this.closeModal()
    },

    removeRole (id) {
      let removeIndex = this.team.roles.findIndex(m => m.id === id)

      let roles = this.team.roles
      roles.splice(removeIndex, 1)

      this.$emit('update:team', { ...this.team, roles: roles })
    }
  }
}
</script>
