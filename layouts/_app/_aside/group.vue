<template lang="html">

  <el-menu-item-group
    v-if="$canSome(permissions)"
    :title="$t('routes.' + title)">

    <template v-if="item.children">
      <component
        v-for="(child, index) in item.children"
        :is="child.type"
        :item="child"
        :key="index"/>
    </template>

  </el-menu-item-group>

</template>

<script type="text/babel">
import renderSidebarItem from './renderSidebarItem'

const mapPermission = (child) => {
  if (child.children) {
    return child.children.map(c => mapPermission(c)).reduce((c, v) => c.concat(v), [])
  }

  return [child.permission || child.name]
}

export default {
  mixins: [renderSidebarItem],

  computed: {
    permissions () {
      if (!this.item.children) return []

      return this.item.children.map(c => mapPermission(c)).reduce((c, v) => c.concat(v), [])
    }
  }
}
</script>
