<template lang="html">

  <el-submenu
    v-if="$canSome(permissions) && item.children"
    :index="item.name"
    :key="item.name"
    @click.native="openLink">

    <template slot="title">
      <i
        v-if="item.icon"
        class="material-icons">
        {{ item.icon }}
      </i>
      <span slot="title">{{ $t('routes.' + title) }}</span>
    </template>

    <template v-for="(child, index) in item.children">
      <component
        :is="child.type"
        :item="child"
        :key="index"
        @click.native="openSubmenu"/>
    </template>

  </el-submenu>

</template>

<script type="text/babel">
import renderSidebarItem from './renderSidebarItem'

export default {
  mixins: [renderSidebarItem],

  computed: {
    permissions () {
      if (!this.item.children) return []

      return this.item.children.map(c => c.permission || c.name)
    }
  },

  methods: {
    async openLink () {
      if (!this.item.link || !this.item.open) return
      this.$router.push({ name: this.item.link })
    },
    async openSubmenu () {
      await this.$store.dispatch('ui/openSubmenu', this.item.name)
    }
  }
}
</script>
