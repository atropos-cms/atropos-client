<template lang="html">
  <el-card class="box-card">
    <div slot="header">
      <span>{{ $t('modules.files.teams.users') }}</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        @click="openModal">
        {{ $t('modules.files.teams.add-users') }}
      </el-button>
    </div>

    <el-table
      :show-header="false"
      :default-sort="{prop: 'name', order: 'ascending'}"
      :data="team.users"
      stripe>

      <el-table-column
        :label="$t('modules.files.teams.name')"
        min-width="200"
        property="id">
        <template slot-scope="scope">
          <user
            :avatar="true"
            :id="scope.row.id"/>
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
            @click="removeUser(scope.row.id)">
            <span><i class="material-icons">delete</i></span>
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      :title="$t('modules.files.teams.add-users')"
      :visible.sync="dialogAddUserVisible">

      <el-form
        ref="form"
        :model="newUser"
        :rules="rules"
        label-position="top"
        label-width="100px">

        <el-form-item
          :label="$t('modules.files.teams.user')"
          prop="id"
          style="padding-bottom: 1em">
          <user-select
            v-model="newUser.id"
            :disabled-users="team.users"
            size="large"/>
        </el-form-item>

        <el-form-item label="Manage">
          <member-manage-toggle v-model="newUser.manage"/>
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
          @click="addNewUser">
          {{ $t('general.ok') }}
        </el-button>

      </span>

    </el-dialog>

  </el-card>
</template>

<script type="text/babel">
import User from '~/components/user'
import userSelect from '~/components/userSelect'
import memberManageToggle from '~/components/modules/files/teams/memberManageToggle'

export default {
  components: {
    User,
    userSelect,
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
      dialogAddUserVisible: false,
      newUser: {
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
      this.dialogAddUserVisible = true

      let users = await this.$store.dispatch('administration/users/GetUsers')

      let firstUser = users[0]
      if (!firstUser) return

      this.newUser.id = firstUser.id
    },

    async closeModal () {
      this.dialogAddUserVisible = false

      this.newUser = {
        id: null,
        manage: false
      }
    },

    addNewUser () {
      let users = this.team.users
      users.splice(1, 0, this.newUser)

      this.$emit('update:team', {...this.team, users: users})

      this.closeModal()
    },

    removeUser (id) {
      let removeIndex = this.team.users.findIndex(m => m.id === id)

      let users = this.team.users
      users.splice(removeIndex, 1)

      this.$emit('update:team', {...this.team, users: users})
    }
  }
}
</script>
