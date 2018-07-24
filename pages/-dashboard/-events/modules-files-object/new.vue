<template lang="html">
  <div>

    <el-card shadow="never">
      <template slot="header">
        <i class="material-icons text-regular">{{ icon }}</i>
        <span>{{ $t('modules.files.files.file') }}</span>
      </template>

      <span>{{ $t('events.modules-files-file.new', {owner: owner.full_name}) }}</span>

      <span>
        "{{ fileName }}"
      </span>
    </el-card>

  </div>
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
      return this.event.content && this.event.content.name
    }
  },

  methods: {
  }
}
</script>
