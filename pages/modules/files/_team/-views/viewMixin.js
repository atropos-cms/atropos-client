import EventBus from '~/utils/event-bus.js'
import checkObjectsPermissions from '~/components/modules/files/objects/checkObjectsPermissions'

export default {
  mixins: [
    checkObjectsPermissions
  ],

  data () {
    return {
      isLoadingObjects: true,
      lastSelected: null,
      refreshInterval: null
    }
  },

  computed: {
    selectedTeam () {
      return this.$store.getters['modules/files/selectedTeam']
    },
    parent () {
      return this.$store.getters['modules/files/parent']
    },
    objects () {
      if (!this.canRead) return []
      let objects = this.$store.getters['modules/files/objects']()

      if (!objects) return []
      return objects.filter(o => o.status === 'ready')
    },
    folders () {
      if (!this.objects) return []
      return this.objects.filter(o => o.kind === 'folder')
    },
    files () {
      if (!this.objects) return []
      return this.objects.filter(o => o.kind === 'file')
    }
  },

  watch: {
    '$route': 'loadObjects'
  },

  // Register and Remove event listeners
  created () {
    EventBus.$on('modules-files-objects--select-object', this.selectObject)
    EventBus.$on('modules-files-objects--deselect-object', this.selectObject)
  },
  destroyed () {
    EventBus.$off('modules-files-objects--select-object', this.selectObject)
    EventBus.$off('modules-files-objects--deselect-object', this.deselectObject)
  },

  mounted () {
    this.loadObjects()
    this.startRefreshInterval()
  },
  beforeDestroy () {
    this.stopRefreshInterval()
  },

  methods: {
    async loadObjects () {
      this.isLoadingObjects = true

      await this.$store.dispatch('modules/files/GetObjects')
      await this.selectObjectFromQuery()

      this.isLoadingObjects = false
    },
    async deselect (event) {
      event.stopPropagation()
      EventBus.$emit('modules-files-objects--close-contextmenu', event)
      await this.$store.dispatch('modules/files/SelectObject', null)
    },
    async contextMenu (event) {
      event.stopPropagation()
      event.preventDefault()
      await this.$store.dispatch('modules/files/SelectObject', null)
      EventBus.$emit('modules-files-objects--open-contextmenu', event)
    },
    async selectObject ({ event, id }) {
      if (event.shiftKey && this.lastSelected) {
        this.selectMultiple({ event, id })
      } else if (event.ctrlKey) {
        this.selectToggleOne({ event, id })
      } else {
        this.selectFromArray({ ids: [id] })
      }
    },
    async selectToggleOne ({ event, id }) {
      let selection = this.$store.getters['modules/files/selectedObjects']
      let isSelected = selection.includes(id)

      if (isSelected) {
        selection = selection.filter(s => s !== id)
      } else {
        selection = [...selection, id]
      }

      await this.$store.dispatch('modules/files/SelectObject', selection)
    },
    async selectFromArray ({ ids }) {
      await this.$store.dispatch('modules/files/SelectObject', [...ids])
      this.lastSelected = ids.slice(-1).pop()
    },
    async selectMultiple ({ event, id }) {
      let startIndex = this.objects.findIndex(o => o.id === id)
      let endIndex = this.objects.findIndex(o => o.id === this.lastSelected)

      let selectionRange = this.objects.slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1)

      await this.$store.dispatch('modules/files/SelectObject', selectionRange.map(o => o.id))
    },
    async deselectObject ({ event, id }) {
      let selection = this.$store.getters['modules/files/selectedObjects']
      await this.$store.dispatch('modules/files/SelectObject', selection.filter(s => s !== id))
    },
    startRefreshInterval () {
      this.refreshInterval = setInterval(() => {
        this.$apiWithoutErrorReporting(() => this.$store.dispatch('modules/files/ReloadFolder'))
      }, 10 * 1000)
    },
    stopRefreshInterval () {
      clearInterval(this.refreshInterval)
    },
    selectObjectFromQuery () {
      if (!this.$route.query.selected) return
      let selection = this.$route.query.selected.split(',')
      this.selectFromArray({ ids: selection })
    }
  }
}
