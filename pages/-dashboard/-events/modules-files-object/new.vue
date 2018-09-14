<template lang="html">
  <event-component :event="event">
    <!-- Header -->
    <template slot="event-name">
      <i class="material-icons text-regular">{{ icon }}</i>
      <span>{{ $t('modules.files.files.file') }}</span>
    </template>

    <!-- Content -->
    <span>{{ $t('events.modules-files-file.new', {owner: owner.full_name}) }}</span>

    <span v-if="!isLinkable">
      "{{ fileName }}"
    </span>

    <a
      v-if="isLinkable"
      class="--has-pointer-cursor"
      @click="openParent">
      "{{ fileName }}"
    </a>

  </event-component>
</template>

<script type="text/babel">
import eventMixin from '../eventMixin.js'
import UsesFileMimetype from '~/mixins/usesFileMimetype'

export default {
  mixins: [eventMixin, UsesFileMimetype],

  props: {
    event: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },

  computed: {
    icon () {
      return this.event.content && this.iconFromMimetype(this.event.content.mime_type)
    },
    fileName () {
      return (this.entity && this.entity.name) || (this.event.content && this.event.content.name)
    },
    isLinkable () {
      return this.event.content && this.event.content.team_id
    },
    entity () {
      return this.$store.getters['modules/files/object'](this.event.entity_id)
    }
  },

  async mounted () {
    return this.$apiWithoutErrorReporting(() => {
      this.$store.dispatch('modules/files/GetObject', { team: this.event.content.team_id, id: this.event.entity_id, preview: true })
    })
  },

  methods: {
    openParent () {
      this.$router.push({ name: 'modules-files-team-parent', params: { team: this.event.content.team_id, parent: this.event.content.parent_id }, query: { selected: this.event.entity_id } })
    }
  }
}
</script>
