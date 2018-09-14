<template lang="html">
  <span>

    <portal to="toolbar">
      <el-button
        type="primary"
        @click="openCreateListDialog">
        <span>{{ $t('general.create') }}</span>
      </el-button>
    </portal>

    <!-- Create List Dialog -->
    <el-dialog
      :title="$t('modules.mails.lists.create-new-list')"
      :visible.sync="showCreateListDialog"
      :close-on-click-modal="false">

      <el-form
        ref="form"
        :model="listCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="createList">

        <el-form-item
          :label="$t('message.modules-mails-lists-create-list')"
          prop="name">
          <el-input
            ref="input"
            v-model="listCopy.name"/>
        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeCreateListDialog">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="createList">
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
      showCreateListDialog: false,
      listCopy: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('validation.modules-mails-lists--name.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    openCreateListDialog () {
      this.showCreateListDialog = true
      this.$nextTick(() => this.$refs.input.focus())
    },
    closeCreateListDialog () {
      this.showCreateListDialog = false
      this.loading = false
      this.listCopy = { name: '' }
    },
    async createList () {
      await this.$refs.form.validate()

      this.loading = true
      let list = await this.$store.dispatch('modules/mails/lists/CreateList', this.listCopy)
      this.loading = false
      this.closeCreateListDialog()
      this.$router.push({ name: 'modules-mails-lists-id', params: { id: list.id } })
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
