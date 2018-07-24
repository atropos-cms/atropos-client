<template lang="html">
  <el-card
    v-if="user"
    class="box-card">

    <div slot="header">
      <span>{{ $t('administration.user.roles') }}</span>
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
      :data="user.roles"
      stripe>

      <el-table-column min-width="200">
        <template slot-scope="scope">
          <nuxt-link :to="{ name: 'administration-roles-id', params: { id: scope.row }}">
            <role :id="scope.row"/>
          </nuxt-link>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('general.remove')"
        fixed="right"
        width="80">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="removeRole(scope.row)">
            <span><i class="material-icons">delete</i></span>
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      :title="$t('administration.user.add-roles')"
      :visible.sync="dialogAddRoleVisible">

      <el-form
        ref="form"
        :model="newRole"
        :rules="rules"
        label-position="top"
        label-width="100px">

        <el-form-item
          :label="$t('administration.user.role')"
          prop="id"
          style="padding-bottom: 1em">
          <role-select
            v-model="newRole.id"
            :disabled-roles="user.roles"
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
          :loading="isSaving"
          type="primary"
          @click="addNewRole">
          {{ $t('general.ok') }}
        </el-button>

      </span>

    </el-dialog>

  </el-card>
</template>

<script type="text/babel">
import _ from 'lodash'
import Role from '~/components/role'
import roleSelect from '~/components/roleSelect'
import saveInTransaction from '~/mixins/saveInTransaction'

export default {
  components: {
    Role,
    roleSelect
  },

  mixins: [saveInTransaction],

  props: {
    userId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      user: null,
      dialogAddRoleVisible: false,
      saving: false,
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

  async mounted () {
    await this.$store.dispatch('administration/roles/GetRoles')
    await this.setUser()
  },

  methods: {
    async setUser () {
      this.user = _.cloneDeep(await this.$store.getters['administration/users/get'](this.userId))
    },
    async openModal () {
      this.dialogAddRoleVisible = true
    },

    async closeModal () {
      this.dialogAddRoleVisible = false

      this.newRole = {
        id: null
      }
    },

    async addNewRole () {
      await this.$refs['form'].validate()

      let roles = this.user.roles

      if (roles.find(r => r === this.newRole.id)) return

      roles.splice(1, 0, this.newRole.id)

      await this.saveInTransaction(
        () => this.$store.dispatch('administration/users/UpdateUser', {
          id: this.user.id,
          roles: roles
        })
      )

      this.closeModal()
    },

    async removeRole (id) {
      let removeIndex = this.user.roles.findIndex(m => m.id === id)

      let roles = this.user.roles
      roles.splice(removeIndex, 1)

      await this.saveInTransaction(
        () => this.$store.dispatch('administration/users/UpdateUser', {
          id: this.user.id,
          roles: roles
        })
      )
    }
  }
}
</script>
