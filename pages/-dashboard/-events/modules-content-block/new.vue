<template lang="html">
  <div>

    <el-card shadow="never">
      <template slot="header">
        <i class="material-icons text-regular">filter_none</i>
        <span>{{ $t('modules.content.blocks.block') }}</span>
      </template>

      <span>{{ $t('events.modules-content-block.new', {owner: owner.full_name}) }}</span>

      <nuxt-link
        v-if="$can('modules-content-blocks')"
        :to="{ name: 'modules-content-blocks-id', params: { id: event.entity_id }}">
        "{{ blockTitle }}"
      </nuxt-link>
      <span v-else>
        "{{ blockTitle }}"
      </span>

    </el-card>

  </div>
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
