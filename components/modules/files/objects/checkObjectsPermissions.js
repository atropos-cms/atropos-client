export default {
  computed: {
    userId () {
      return this.$store.getters['profile/id']
    },
    team () {
      let selectedTeam = this.$store.getters['modules/files/selectedTeam']
      return this.$store.getters['modules/files/team'](selectedTeam)
    },
    canRead () {
      if (!this.team) return false
      return this.team.canRead
    },
    canWrite () {
      if (!this.team) return false
      return this.team.canWrite
    }
  },
  methods: {
    canReadInTeam (id) {
      let team = this.$store.getters['modules/files/team'](id)
      if (!team) return false
      return team.canRead
    },
    canWriteInTeam (id) {
      let team = this.$store.getters['modules/files/team'](id)
      if (!team) return false
      return team.canWrite
    }
  }
}
