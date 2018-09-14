export default {
  components: {
    'item': () => import('./item'),
    'group': () => import('./group'),
    'submenu': () => import('./submenu')
  },

  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    route () {
      return this.$router.resolve({ name: this.item.name }).route.path
    },

    title () {
      return this.item.title || this.item.name
    },

    permission () {
      return this.item.permission || this.item.name
    }
  }
}
