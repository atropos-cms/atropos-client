<template lang="html">
  <div class="team-wrapper">
    <header-breadcrumb/>
    <header-toolbar/>

    <nuxt-child/>
  </div>
</template>

<script type="text/babel">
import HeaderBreadcrumb from '~/components/modules/files/objects/headerBreadcrumb'
import HeaderToolbar from '~/components/modules/files/objects/headerToolbar'

export default {
  meta: {
    permission: 'modules-files-objects',
    headerShowBreadcrumb: true
  },

  transition: 'none',

  components: {
    HeaderBreadcrumb,
    HeaderToolbar
  }
}
</script>
