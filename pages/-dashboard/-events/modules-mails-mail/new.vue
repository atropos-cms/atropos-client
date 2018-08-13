<template lang="html">
  <div>
    <event-component
      not-deletable
      :event="event">
      <!-- Header -->
      <template slot="event-name">
        <i class="material-icons text-regular">mail_outline</i>
        <span>{{ $t('modules.mails.send.mail') }}</span>
      </template>

      <!-- Content -->
      <span>{{ $t('events.modules-mails-mail.new', {owner: owner.full_name}) }}</span>

      <el-button
        type="text"
        @click="dialogVisible = true">
        "{{ subject }}"
      </el-button>

    </event-component>

    <el-dialog
      :title="subject"
      :visible.sync="dialogVisible">

      <span
        class="--is-selectable"
        v-html="content"/>

      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('general.close') }}</el-button>
      </span>
    </el-dialog>

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

  data () {
    return {
      dialogVisible: false
    }
  },

  computed: {
    subject () {
      return this.event.content && this.event.content.subject
    },
    content () {
      return this.event.content && this.event.content.content
    }
  },

  methods: {
  }
}
</script>
