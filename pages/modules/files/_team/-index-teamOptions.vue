<template lang="html">
  <div>
    <el-card
      :body-style="{ padding: '0px' }"
      class="box-card modules-files-objects--team-options">

      <el-menu
        :default-active="selectedOption"
        @select="changeTeam">
        <el-menu-item index="stared">
          <i class="material-icons">star</i>
          <span>{{ $t('modules.files.files.stared') }}</span>
        </el-menu-item>

        <el-menu-item index="recent">
          <i class="material-icons">query_builder</i>
          <span>{{ $t('modules.files.files.recent') }}</span>
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
    selectedOption () {
      return 'stared'
    },
    selectedTeam () {
      return this.$store.getters['modules/files/selectedTeam']
    }
  },

  methods: {
    changeTeam (index) {
      this.$router.push({ name: 'modules-files-team-parent', params: { team: this.selectedTeam, parent: null } })
    }
  }
}
</script>
