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

    <!-- Mail dialog -->
    <el-dialog
      :title="$t('events.modules-mails-mail.new', {owner: owner.full_name})"
      :visible.sync="dialogVisible"
      class="modules-mails-preview-dialog">

      <div class="modules-mails-preview-header">

        <el-row
          :gutter="20"
          type="flex"
          align="middle">
          <el-col :span="2">{{ $t('modules.mails.send.from') }}</el-col>
          <el-col :span="22">
            <b><user :id="event.content.sender_id" /></b>
          </el-col>
        </el-row>

        <el-row
          :gutter="20"
          type="flex"
          align="middle">
          <el-col :span="2">{{ $t('modules.mails.send.subject') }}</el-col>
          <el-col :span="22">
            <b>{{ subject }}</b>
          </el-col>
        </el-row>

        <el-row
          v-if="attachments"
          :gutter="20"
          type="flex"
          align="middle">
          <el-col :span="2">{{ $t('modules.mails.send.attachments') }}</el-col>
          <el-col :span="22">

            <el-tag
              v-for="attachment in attachments"
              :key="attachment.id"
              class="--has-pointer-cursor"
              @click.native="downloadMediaFile(attachment.id)">
              {{ attachment.name }}
            </el-tag>

          </el-col>
        </el-row>

      </div>

      <div class="modules-mails-preview-logo">
        <logo :icon="false"/>
      </div>

      <div class="modules-mails-preview-content">

        <span
          class="--is-selectable"
          v-html="content"/>

      </div>

      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('general.close') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script type="text/babel">
import logo from '~/components/logo'
import User from '~/components/user'
import eventMixin from '../eventMixin.js'
import UsesFileMimetype from '~/mixins/usesFileMimetype'
import downloadMediaFile from '~/mixins/downloadMediaFile'

export default {
  components: {
    logo,
    User
  },

  mixins: [eventMixin, UsesFileMimetype, downloadMediaFile],

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
    },
    attachments () {
      if (!this.event.content || !this.event.content.attachments) return null

      return this.event.content.attachments.map(a => {
        return this.$store.getters['modules/media/browser/file'](a)
      }).filter(e => !!e)
    }
  },

  methods: {
  }
}
</script>
