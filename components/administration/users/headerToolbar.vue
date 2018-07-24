<template lang="html">
  <span>

    <portal to="toolbar">
      <el-button
        type="primary"
        @click="openCreateUserDialog">
        <span>{{ $t('general.create') }}</span>
      </el-button>
    </portal>

    <!-- Create User Dialog -->
    <el-dialog
      :title="$t('administration.user.create-new-user')"
      :visible.sync="showCreateUserDialog"
      :close-on-click-modal="false">

      <el-form
        ref="form"
        :model="userCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="createUser">

        <el-form-item
          :label="$t('administration.user.first_name')"
          prop="first_name">
          <el-input
            ref="input"
            v-model="userCopy.first_name"/>
        </el-form-item>

        <el-form-item
          :label="$t('administration.user.last_name')"
          prop="last_name">
          <el-input
            v-model="userCopy.last_name"/>
        </el-form-item>

        <el-form-item
          :label="$t('administration.user.email')"
          prop="email">
          <el-input
            v-model="userCopy.email"/>
        </el-form-item>

        <el-form-item
          :label="$t('administration.user.roles')"
          prop="roles">
          <role-select
            v-model="userCopy.roles"
            default-to-users
            multiple/>
        </el-form-item>

        <div>
          <el-checkbox
            v-model="userCopy.activated">
            {{ $t('administration.user.activate') }}
          </el-checkbox>
        </div>

        <div>
          <el-checkbox
            v-model="userCopy.notify_account_created">
            {{ $t('administration.user.notify_account_created') }}
          </el-checkbox>
        </div>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeCreateUserDialog">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="createUser">
          {{ $t('general.ok') }}
        </el-button>

      </span>
    </el-dialog>

  </span>
</template>

<script type="text/babel">
import roleSelect from '~/components/roleSelect'

export default {
  components: {
    roleSelect
  },

  data () {
    return {
      loading: false,
      showCreateUserDialog: false,
      userCopy: {
        first_name: '',
        last_name: '',
        email: '',
        activated: true,
        roles: [],
        notify_account_created: true
      },
      rules: {
        first_name: [
          { required: true, message: this.$t('validation.first_name.required'), trigger: 'change' }
        ],
        last_name: [
          { required: true, message: this.$t('validation.last_name.required'), trigger: 'change' }
        ],
        email: [
          { required: true, message: this.$t('validation.email.required'), trigger: 'change' },
          { type: 'email', message: this.$t('validation.email.type'), trigger: ['blur', 'change'] }
        ]
      }
    }
  },

  async mounted () {
    // get the list of all roles
    await this.$store.dispatch('administration/roles/GetRoles')
    const roles = this.$store.getters['administration/roles/list']

    // check if there is a role with the name Users
    const userRole = roles.find(r => r.name === 'Users')
    if (!userRole) return

    // set tthe default role in the list
    this.userCopy.roles = [userRole.id]
  },

  methods: {
    openCreateUserDialog () {
      this.showCreateUserDialog = true
      this.$nextTick(() => this.$refs.input.focus())
    },
    closeCreateUserDialog () {
      this.showCreateUserDialog = false
      this.loading = false
      this.userCopy = {
        first_name: '',
        last_name: '',
        email: '',
        activated: true,
        roles: []
      }
    },
    async createUser () {
      await this.$refs.form.validate()

      this.loading = true

      try {
        let user = await this.$store.dispatch('administration/users/CreateUser', this.userCopy)

        this.closeCreateUserDialog()
        this.$router.push({ name: 'administration-users-id', params: { id: user.id } })
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
