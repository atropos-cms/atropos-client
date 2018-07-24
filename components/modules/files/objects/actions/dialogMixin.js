import _ from 'lodash'

export default {
  props: {
    objectId: {
      type: String,
      required: false,
      default: null
    },
    visible: {
      type: Boolean,
      required: false,
      default: false
    },
    beforeClose: {
      type: Function,
      required: false,
      default: () => {}
    }
  },

  data () {
    return {
      objectCopy: null,
      loading: false
    }
  },

  methods: {
    async open () {
      this.$emit('update:visible', true)
      await this.opened()
    },
    close () {
      this.$emit('update:visible', false)
    },
    cancel () {
      this.$emit('cancel')
      this.$emit('closed')
    },
    async ok () {
      await this.action()

      this.$emit('ok')
      this.$emit('closed')
    },

    // 'abstract' methods
    opened () {},
    action () {}
  },

  watch: {
    visible (newValue) {
      // reset the local object copy
      this.objectCopy = null

      // if the dialog is opened, trigger event
      if (newValue) {
        this.opened()
      }

      // if the opject copy has been set in the open event, return
      if (this.objectCopy) return

      // otherwise, try and set the object from the store
      let file = this.$store.getters['modules/files/index/object'](this.objectId)
      this.objectCopy = _.cloneDeep(file)
    }
  }
}
