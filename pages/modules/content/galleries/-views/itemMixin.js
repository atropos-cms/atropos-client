import { ElementMixin } from 'vue-slicksort'

export default {
  mixins: [ElementMixin],

  props: {
    item: {
      type: String,
      require: true,
      default () {
        return null
      }
    },
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
    isSelected () {
      return this.selected.includes(this.item)
    },
    isCover () {
      return this.cover === this.item
    },
    image () {
      return this.$store.getters['modules/media/browser/file'](this.item)
    },
    imageSrc () {
      if (!this.image) return
      return this.image.s[300]
    }
  },

  methods: {
    select (event) {
      if (this.isSelected) {
        this.deselect()
        return
      }

      this.$emit('select')
    },
    deselect (event) {
      this.$emit('deselect')
    },
    setCover (event) {
      if (this.isCover) return

      this.$emit('cover')
    }
  }
}
