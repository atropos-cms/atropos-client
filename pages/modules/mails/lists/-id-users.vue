<template lang="html">
  <el-card class="box-card">
    <div slot="header">
      <span>{{ $t('modules.mails.lists.users') }}</span>
      <el-button
        style="float: right; padding: 3px 0"
        type="text"
        @click="openModal">
        {{ $t('modules.mails.lists.add-users') }}
      </el-button>
    </div>

    <el-table
      :show-header="false"
      :default-sort="{prop: 'name', order: 'ascending'}"
      :data="list.users"
      stripe>

      <el-table-column
        :label="$t('modules.mails.lists.name')"
        property="id">
        <template slot-scope="scope">
          <user
            :avatar="true"
            :id="scope.row.id"/>
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
            @click="removeUser(scope.row.id)">
            <span><i class="material-icons">delete</i></span>
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      :title="$t('modules.mails.lists.add-users')"
      :visible.sync="dialogAddUserVisible">

      <el-form
        ref="form"
        :model="newUser"
        :rules="rules"
        label-position="top"
        label-width="100px">

        <el-form-item
          :label="$t('modules.mails.lists.user')"
          prop="id"
          style="padding-bottom: 1em">
          <user-select
            v-model="newUser.id"
            :disabled-users="list.users"
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

export default {
  components: {
    User,
    userSelect
  },

  props: {
    list: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      dialogAddUserVisible: false,
      newUser: {
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
      this.dialogAddUserVisible = true

      let users = await this.$store.dispatch('administration/users/GetUsers')
      let selectedUsersList = this.list.users.map(u => u.id || u)

      let firstUser = users.find(u => !selectedUsersList.includes(u.id))
      if (!firstUser) return

      this.newUser.id = firstUser.id
    },

    async closeModal () {
      this.dialogAddUserVisible = false

      this.newUser = {
        id: null
      }
    },

    addNewUser () {
      let users = this.list.users
      users.splice(1, 0, this.newUser)

      this.$emit('update:list', {...this.list, users: users})

      this.closeModal()
    },

    removeUser (id) {
      let removeIndex = this.list.users.findIndex(m => m.id === id)

      let users = this.list.users
      users.splice(removeIndex, 1)

      this.$emit('update:list', {...this.list, users: users})
    }
  }
}
</script>
