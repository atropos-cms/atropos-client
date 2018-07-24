<template lang="html">
  <div>
    <el-card
      :body-style="{ padding: '0px' }"
      class="box-card modules-files-objects--team-list">

      <el-menu
        :default-active="selectedTeam"
        @select="changeTeam">
        <el-menu-item
          v-for="team in teams"
          :key="team.id"
          :index="team.id"
        >
          <i class="material-icons">storage</i>
          <span>{{ team.name }}</span>
        </el-menu-item>
      </el-menu>

    </el-card>

  </div>
</template>

<script type="text/babel">
import checkObjectsPermissions from '~/components/modules/files/objects/checkObjectsPermissions'

export default {
  mixins: [checkObjectsPermissions],

  computed: {
    teams () {
      let teams = this.$store.getters['modules/files/index/teams']
      return teams.filter(team => this.canReadInTeam(team.id))
    },
    selectedTeam () {
      return this.$store.getters['modules/files/index/selectedTeam']
    },
    hasMoreThanOneTeam () {
      return this.teams.length > 1
    }
  },

  methods: {
    changeTeam (index) {
      this.$router.push({ name: 'modules-files-team-parent', params: { team: index, parent: null } })
    },
    navigateToTeams () {
      this.$router.push({ name: 'modules-files-teams' })
    }
  }
}
</script>
