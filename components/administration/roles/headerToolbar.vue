<template lang="html">
  <span>

    <portal to="toolbar">
      <el-button
        type="primary"
        @click="openCreateRoleDialog">
        <span>{{ $t('general.create') }}</span>
      </el-button>
    </portal>

    <!-- Create Role Dialog -->
    <el-dialog
      :title="$t('administration.roles.create-new-role')"
      :visible.sync="showCreateRoleDialog"
      :close-on-click-modal="false">

      <el-form
        ref="form"
        :model="roleCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="createRole">

        <el-form-item
          :label="$t('administration.roles.name')"
          prop="name">
          <el-input
            ref="input"
            v-model="roleCopy.name"/>
        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeCreateRoleDialog">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="createRole">
          {{ $t('general.ok') }}
        </el-button>

      </span>
    </el-dialog>

  </span>
</template>

<script type="text/babel">
export default {
  data () {
    return {
      loading: false,
      showCreateRoleDialog: false,
      roleCopy: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('validation.roles-name.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    openCreateRoleDialog () {
      this.showCreateRoleDialog = true
      this.$nextTick(() => this.$refs.input.focus())
    },
    closeCreateRoleDialog () {
      this.showCreateRoleDialog = false
      this.loading = false
      this.roleCopy = {
        name: ''
      }
    },
    async createRole () {
      await this.$refs.form.validate()

      this.loading = true
      let role = await this.$store.dispatch('administration/roles/CreateRole', this.roleCopy)

      this.loading = false

      this.closeCreateRoleDialog()
      this.$router.push({ name: 'administration-roles-id', params: { id: role.id } })
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
