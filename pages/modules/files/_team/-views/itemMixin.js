import EventBus from '~/utils/event-bus.js'
import Icon from '~/components/modules/files/objects/icon'

export default {
  props: {
    file: {
      type: Object,
      require: true,
      default () {
        return null
      }
    }
  },

  components: {
    Icon
  },

  computed: {
    isSelected () {
      return this.$store.getters['modules/files/selectedObjects'].includes(this.file.id)
    },
    isFolder () {
      return this.file.kind === 'folder'
    },
    isObject () {
      return this.file.kind === 'file'
    }
  },

  methods: {
    async touchend (event) {
      // prevent the click event
      event.preventDefault()

      // if the item is selected, open it
      if (this.isSelected) {
        return this.open(event)
      }

      // otherwise, select it
      return this.select(event)
    },

    async select (event) {
      event.stopPropagation()
      EventBus.$emit('modules-files-objects--close-contextmenu', event)
      EventBus.$emit('modules-files-objects--select-object', { event, id: this.file.id })
    },
    async deselect (event) {
      event.stopPropagation()
      EventBus.$emit('modules-files-objects--close-contextmenu', event)
      EventBus.$emit('modules-files-objects--deselect-object', { event, id: this.file.id })
    },

    async contextMenu (event) {
      event.stopPropagation()
      event.preventDefault()
      if (!this.isSelected) {
        EventBus.$emit('modules-files-objects--select-object', { event, id: this.file.id })
      }
      EventBus.$emit('modules-files-objects--open-contextmenu', event)
    },

    async open () {
      let teamId = this.$store.getters['modules/files/selectedTeam']

      if (this.isFolder) {
        return this.$router.push({ name: 'modules-files-team-parent', params: { team: teamId, parent: this.file.id } })
      }
      if (this.isObject) {
        let selectedObjects = this.$store.getters['modules/files/selectedObjects']
        return EventBus.$emit('modules-files-objects--download-object', selectedObjects)
      }
    }
  }
}
