<template lang="html">
  <el-card class="box-card">
    <div slot="header">
      <span>{{ $t('modules.mails.lists.roles') }}</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        @click="openModal">
        {{ $t('modules.mails.lists.add-roles') }}
      </el-button>
    </div>

    <el-table
      :show-header="false"
      :default-sort="{prop: 'name', order: 'ascending'}"
      :data="list.roles"
      stripe>

      <el-table-column
        :label="$t('modules.mails.lists.name')"
        property="id">
        <template slot-scope="scope">
          <role :id="scope.row.id"/>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('general.remove')"
        property="id"
        align="right"
        width="100px">
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
      :title="$t('modules.mails.lists.add-roles')"
      :visible.sync="dialogAddRoleVisible">

      <el-form
        ref="form"
        :model="newRole"
        :rules="rules"
        label-position="top"
        label-width="100px">

        <el-form-item
          :label="$t('modules.mails.lists.role')"
          prop="id"
          style="padding-bottom: 1em">
          <role-select
            v-model="newRole.id"
            :disabled-roles="list.roles"
            size="large"/>
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

export default {
  components: {
    Role,
    roleSelect
  },

  props: {
    list: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      dialogAddRoleVisible: false,
      newRole: {
        id: null
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
      let selectedRolesList = this.list.roles.map(r => r.id || r)

      let firstRole = roles.find(r => !selectedRolesList.includes(r.id))
      if (!firstRole) return

      this.newRole.id = firstRole.id
    },

    async closeModal () {
      this.dialogAddRoleVisible = false

      this.newRole = {
        id: null
      }
    },

    addNewRole () {
      let roles = this.list.roles
      roles.splice(1, 0, this.newRole)

      this.$emit('update:list', {...this.list, roles: roles})

      this.closeModal()
    },

    removeRole (id) {
      let removeIndex = this.list.roles.findIndex(m => m.id === id)

      let roles = this.list.roles
      roles.splice(removeIndex, 1)

      this.$emit('update:list', {...this.list, roles: roles})
    }
  }
}
</script>
