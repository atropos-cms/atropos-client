<template lang="html">
  <el-menu-item
    v-if="$can(permission)"
    :index="item.name"
    :route="route"
    :key="item.name">

    <i
      v-if="item.icon"
      class="material-icons">
      {{ item.icon }}
    </i>

    <span slot="title">{{ $t('routes.' + title) }}</span>
  </el-menu-item>
</template>

<script type="text/babel">
import renderSidebarItem from './renderSidebarItem'

export default {
  mixins: [renderSidebarItem]
}
</script>
