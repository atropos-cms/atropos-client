<template lang="html">
  <div
    v-if="loggedIn"
    class="page-header">

    <el-row
      :gutter="20"
      type="flex"
      align="center"
      class="--flex-wrap">

      <el-col
        :span="24"
        :md="12">
        <h3 class="page-title">{{ $t(pageTitle) }}</h3>

        <div :class="{'force-breadcrumbs': headerShowBreadcrumb}">
          <portal-target name="breadcrumb"/>
        </div>
      </el-col>

      <el-col
        :span="24"
        :md="12"
        class="page-header--toolbar">
        <portal-target name="toolbar"/>
      </el-col>

    </el-row>
  </div>
</template>

<script type="text/babel">
export default {
  computed: {
    headerShowBreadcrumb () {
      return this.$store.getters['ui/headerShowBreadcrumb']
    },
    loggedIn () {
      return this.$store.getters['profile/loggedIn']
    },
    routeMeta () {
      return this.$store.getters['routeMeta']
    },
    pageTitle () {
      if (this.routeMeta && this.routeMeta.header) {
        return this.routeMeta.header.title
      }

      return 'routes.' + this.$route.name
    }
  }
}
</script>
