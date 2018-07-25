<template lang="html">
  <div>

    <el-card shadow="never">
      <template slot="header">
        <i class="material-icons text-regular">{{ icon }}</i>
        <span>{{ $t('modules.files.files.file') }}</span>
      </template>

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
    </el-card>

  </div>
</template>

<script type="text/babel">
import EventBus from '~/utils/event-bus.js'
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
      return this.event.content && this.event.content.name
    },
    isLinkable () {
      return this.event.content && this.event.content.team_id && this.event.content.parent_id
    }
  },

  methods: {
    openParent () {
      this.$router.push({ name: 'modules-files-team-parent', params: { team: this.event.content.team_id, parent: this.event.content.parent_id }, query: { selected: this.event.entity_id} })
    }
  }
}
</script>
