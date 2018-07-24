import { ContainerMixin } from 'vue-slicksort'

export default {
  mixins: [ContainerMixin],

  props: {
    selected: {
      type: null,
      default: null
    },
    cover: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    hasFiles () {
      return this.$store.getters['modules/media/browser/hasFiles']
    }
  },

  methods: {
    add (event) {
      this.$emit('add')
    },
    select (id) {
      this.$emit('select', id)
    },
    deselect (id) {
      this.$emit('deselect', id)
    },
    setCover (id) {
      this.$emit('cover', id)
    }
  }
}
