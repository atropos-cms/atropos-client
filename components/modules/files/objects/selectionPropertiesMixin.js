export default {
  computed: {
    hasSelected () {
      let selected = this.$store.getters['modules/files/selectedObjects']
      return selected && selected.length >= 1
    },
    oneSelected () {
      let selected = this.$store.getters['modules/files/selectedObjects']
      return selected && selected.length === 1
    },
    selectedObjects () {
      let selectedIds = this.$store.getters['modules/files/selectedObjects']
      return selectedIds.map(id => this.$store.getters['modules/files/object'](id)).filter(o => o !== undefined)
    },
    isDownloadable () {
      if (!this.selectedObjects) return
      return this.selectedObjects.reduce((carry, object) => carry && object.status === 'ready', true)
    },
    availableTags () {
      let selectedTeamId = this.$store.getters['modules/files/selectedTeam']
      let team = this.$store.getters['modules/files/team'](selectedTeamId)
      return team.tags
    },
    allSelectedStared () {
      if (!this.selectedObjects) return
      return this.selectedObjects.reduce((carry, object) => carry && object.stared, true)
    }
  }
}
