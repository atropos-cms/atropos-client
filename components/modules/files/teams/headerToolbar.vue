<template lang="html">
  <span>

    <portal to="toolbar">
      <el-button
        type="primary"
        @click="openCreateTeamDialog">
        <span>{{ $t('general.create') }}</span>
      </el-button>
    </portal>

    <!-- Create Team Dialog -->
    <el-dialog
      :title="$t('modules.files.teams.create-new-team')"
      :visible.sync="showCreateTeamDialog"
      :close-on-click-modal="false">

      <el-form
        label-position="top"
        @submit.native.prevent="createTeam">
        <el-form-item :label="$t('message.modules-files-teams-create-team')">
          <el-input
            ref="input"
            v-model="teamCopy.name"/>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeCreateTeamDialog">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="createTeam">
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
      showCreateTeamDialog: false,
      teamCopy: { name: '' }
    }
  },

  methods: {
    openCreateTeamDialog () {
      this.showCreateTeamDialog = true
      this.$nextTick(() => this.$refs.input.focus())
    },
    closeCreateTeamDialog () {
      this.showCreateTeamDialog = false
      this.loading = false
      this.teamCopy = { name: '' }
    },
    async createTeam () {
      this.loading = true
      let team = await this.$store.dispatch('modules/files/CreateTeam', this.teamCopy)
      this.loading = false
      this.closeCreateTeamDialog()
      this.$router.push({ name: 'modules-files-teams-id', params: { id: team.id } })
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
