<template lang="html">
  <portal to="breadcrumb">

    <el-breadcrumb separator="/">

      <el-breadcrumb-item>
        <span
          v-if="team"
          class="breadcrumb--file-team-name"
          @click="navigateToTeam">
          <i class="material-icons">
            dns
          </i>

          <span>{{ team.name }}</span>
        </span>
      </el-breadcrumb-item>

      <el-breadcrumb-item
        v-for="file in pathStack"
        :key="file.id"
        class="breadcrumb--file-folder-name">

        <span
          v-if="file.id === 'collapsed'"
          class="--is-collapsed">
          ...
        </span>

        <span
          v-else
          @click="navigateToFolder(file.id)">
          {{ file.name }}
        </span>

      </el-breadcrumb-item>
    </el-breadcrumb>

  </portal>
</template>

<script type="text/babel">
export default {
  computed: {
    hasSelected () {
      return !!this.$store.getters['modules/files/selectedObject']
    },
    team () {
      let selectedTeam = this.$store.getters['modules/files/selectedTeam']
      return this.$store.getters['modules/files/team'](selectedTeam)
    }
  },

  asyncComputed: {
    async pathStack () {
      let parentId = this.$store.getters['modules/files/parent']
      return this.getParents(parentId)
    }
  },

  methods: {
    async getParents (parentId, carry = []) {
      if (parentId === null) return carry

      try {
        let file = await this.$store.dispatch('modules/files/GetObject', {id: parentId})
        if (!file) return carry

        // check the length of the path
        let pathlength = carry.map(f => f.name).reduce((c, p) => c + p.length, 0)
        if (pathlength > 45) {
          // if the path is longer than 45 characters, add a collapsed item and return
          carry.unshift({
            id: 'collapsed'
          })
          return carry
        }

        carry.unshift(file)

        if (file.parent_id) {
          await this.getParents(file.parent_id, carry)
        }
      } catch (e) {
        return this.$router.push({name: 'modules-files-team-parent'})
      }

      return carry
    },
    navigateToTeam () {
      let teamId = this.$store.getters['modules/files/selectedTeam']
      return this.$router.push({ name: 'modules-files-team-parent', params: { team: teamId, parent: null } })
    },
    navigateToFolder (id) {
      let teamId = this.$store.getters['modules/files/selectedTeam']
      return this.$router.push({ name: 'modules-files-team-parent', params: { team: teamId, parent: id } })
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
