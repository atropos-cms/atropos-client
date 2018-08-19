<template>
  <div>

    <el-row
      v-if="team"
      :gutter="20">

      <el-col :span="24">
        <team-team
          :team.sync="team"/>

        <team-roles
          :team.sync="team"/>

        <team-users
          :team.sync="team"/>

        <div class="button-container">

          <el-button
            @click="cancel">
            {{ $t('general.cancel') }}
          </el-button>

          <el-button
            :loading="isSaving"
            type="primary"
            @click="save">
            {{ $t('general.save') }}
          </el-button>

        </div>

      </el-col>
    </el-row>

  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import saveInTransaction from '~/mixins/saveInTransaction'
import teamTeam from './-id-team'
import teamRoles from './-id-roles'
import teamUsers from './-id-users'

export default {
  meta: {
    sidebar: {
      active: 'modules-files'
    }
  },

  components: {
    teamTeam,
    teamRoles,
    teamUsers
  },

  mixins: [
    saveInTransaction
  ],

  async asyncData ({store, params}) {
    await store.dispatch('modules/files/GetTeams')
    return {team: _.cloneDeep(store.getters['modules/files/team'](params.id))}
  },

  data () {
    return {
      team: null,
      teamEditPage: 'account'
    }
  },

  methods: {
    async setTeam () {
      this.team = _.cloneDeep(_.cloneDeep(this.$store.getters['modules/files/team'](this.$route.params.id)))
    },

    async save () {
      await this.saveInTransaction(
        () => this.$store.dispatch('modules/files/UpdateTeam', this.team)
      )
      this.setTeam()
    },

    cancel () {
      this.setTeam()
    }
  }
}
</script>
