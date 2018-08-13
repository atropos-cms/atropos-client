<template lang="html">
  <event-component :event="event">
    <!-- Header -->
    <template slot="event-name">
      <i class="material-icons text-regular">photo_library</i>
      <span>{{ $t('modules.content.galleries.gallery') }}</span>
    </template>

    <!-- Content -->
    <span>{{ $t('events.modules-content-gallery.new', {owner: owner.full_name}) }}</span>

    <nuxt-link
      v-if="$can('modules-content-galleries')"
      :to="{ name: 'modules-content-galleries-id', params: { id: event.entity_id }}">
      "{{ galleryTitle }}"
    </nuxt-link>
    <span v-else>
      "{{ galleryTitle }}"
    </span>

  </event-component>
</template>

<script type="text/babel">
import eventMixin from '../eventMixin.js'

export default {
  mixins: [eventMixin],

  props: {
    event: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },

  computed: {
    galleryTitle () {
      return this.event.content && this.event.content.title
    },
    galleryImages () {
      return this.event.content && this.event.content.images
    }
  },

  methods: {
    imageSrc (id) {
      let image = this.$store.getters['modules/media/browser/file'](id)
      if (!image) return false
      return image.r[300]
    }
  }
}
</script>
