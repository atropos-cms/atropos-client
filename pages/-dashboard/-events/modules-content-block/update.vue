<template lang="html">
  <event-component :event="event">
    <!-- Header -->
    <template slot="event-name">
      <i class="material-icons text-regular">filter_none</i>
      <span>{{ $t('modules.content.blocks.block') }}</span>
    </template>

    <!-- Content -->
    <span>{{ $t('events.modules-content-block.update', {owner: owner.full_name}) }}</span>

    <nuxt-link
      v-if="$can('modules-content-blocks')"
      :to="{ name: 'modules-content-blocks-id', params: { id: event.entity_id }}">
      "{{ blockTitle }}"
    </nuxt-link>
    <span v-else>
      "{{ blockTitle }}"
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
    blockTitle () {
      return this.event.content && this.event.content.title
    }
  }
}
</script>
