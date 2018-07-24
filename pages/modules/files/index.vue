<script type="text/babel">
import checkObjectsPermissions from '~/components/modules/files/objects/checkObjectsPermissions'

export default {
  meta: {
    permission: 'modules-files-objects'
  },

  mixins: [
    checkObjectsPermissions
  ],

  computed: {
    selectedTeam () {
      return this.$store.getters['modules/files/index/selectedTeam']
    }
  },

  async created () {
    let teams = await this.$store.dispatch('modules/files/index/GetTeams')

    for (let team of teams) {
      if (this.canReadInTeam(team.id)) {
        this.$router.replace({ name: 'modules-files-team-parent', params: { team: team.id, parent: null } })
        return
      }
    }

    this.$router.replace({ name: 'modules-files-team-parent', params: { team: 'null', parent: null } })
  },

  render: (h) => h()
}
</script>
