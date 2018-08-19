<template lang="html">
  <div class="modules-files-objects--page">

    <!-- Components -->

    <context-menu/>
    <file-actions/>

    <no-content
      v-if="!teams.length"
      :text="$t('modules.files.files.no-teams')"
      illustration="41"/>

    <el-row
      v-if="teams.length"
      :gutter="10"
      class="--flexed-row --flex-wrap">
      <el-col
        :md="7"
        :lg="5"
        :xl="4">

        <!-- Options will let you filter by stared -->
        <!-- <team-options/> -->

        <team-list/>

      </el-col>

      <no-ssr>
        <el-col
          :md="17"
          :lg="showInfo ? 13 : 19"
          :xl="showInfo ? 15 : 20"
          :class="{'--is-drag-over-target': dragIsOverTarget, '--can-upload': canWrite}"
          class="--growing-col dropzone"
          @drop.native.prevent="dropWrapped"
          @dragover.native.stop.prevent="dragoverWrapped"
          @dragleave.native.self.prevent="dragleave">

          <component :is="currentView"/>

        </el-col>
      </no-ssr>
      <no-ssr>
        <el-col
          v-if="showInfo"
          :lg="6"
          :xl="5"
          class="hidden-md-and-down --growing-col">

          <selection-info />

        </el-col>

      </no-ssr>
    </el-row>

  </div>
</template>

<script type="text/babel">
import NoContent from '~/components/noContent'
import uploadObjectsMixin from '~/components/modules/files/objects/uploadObjects'
import ContextMenu from '~/components/modules/files/objects/contextMenu'
import FileActions from '~/components/modules/files/objects/actions'
import checkObjectsPermissions from '~/components/modules/files/objects/checkObjectsPermissions'
import TeamList from './-index-teamList'
import TeamOptions from './-index-teamOptions'
import SelectionInfo from './-selection-info'
import ViewGrid from './-views/-grid'
import ViewList from './-views/-list'

export default {
  transition: 'none',

  components: {
    ContextMenu,
    NoContent,
    FileActions,
    TeamList,
    TeamOptions,
    SelectionInfo,
    ViewGrid,
    ViewList
  },

  mixins: [
    uploadObjectsMixin,
    checkObjectsPermissions
  ],

  async fetch ({ store, params }) {
    await store.dispatch('modules/files/GetTeams')
    try {
      await store.dispatch('modules/files/SelectTeam', params.team)
      await store.dispatch('modules/files/OpenFolder', params.parent || 'null')
    } catch (e) {}
  },

  computed: {
    currentView () {
      let view = this.$store.getters['modules/files/view']
      return `view-${view}`
    },
    teams () {
      let teams = this.$store.getters['modules/files/teams']
      return teams.filter(team => this.canReadInTeam(team.id))
    },
    showInfo () {
      return this.$store.getters['modules/files/info']
    }
  },

  watch: {
    // call again the method if the route changes
    '$route': 'setParent'
  },

  mounted () {
    this.$store.dispatch('modules/files/LockObjectSelection', false)
  },

  methods: {
    setParent () {
      this.$store.dispatch('modules/files/OpenFolder', this.$route.params.parent)
    },
    dropWrapped (event) {
      if (!this.canWrite) return
      this.drop(event)
    },
    dragoverWrapped (event) {
      if (!this.canWrite) return
      this.dragover(event)
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
