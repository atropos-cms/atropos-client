<template lang="html">
  <div>
    <header-toolbar
      :sending="sending"
      @sendMail="sendMail"/>

    <el-card
      :body-style="{ padding: '0px' }"
      class="box-card modules-mails-send--card modules-mails-send--flex-content-box">

      <el-form
        ref="form"
        :rules="rules"
        :model="mail"
        label-position="right"
        label-width="120px"
      >

        <div class="modules-mails-send--header-form">

          <el-form-item
            :label="$t('modules.mails.send.to')"
            prop="to">

            <el-select
              v-model="mail.to"
              :disabled="sending"
              :placeholder="$t('modules.mails.send.select-recipient')"
              filterable
              multiple
              popper-class="modules-mails-send--select-recipient">

              <el-option-group :label="$t('modules.mails.lists.mailinglists')">

                <el-option
                  v-for="list in lists"
                  :key="list.id"
                  :label="list.name"
                  :value="`list:${list.id}`">
                  <span style="float: left">{{ list.name }}</span>

                  <span
                    style="float: right"
                    class="text-secondary">
                    {{ $tc('modules.mails.send.members-count', list.members_count, {count: list.members_count}) }}
                  </span>

                </el-option>
              </el-option-group>

              <el-option-group
                :label="$t('modules.mails.lists.users')">
                <el-option
                  v-for="user in users"
                  :key="user.id"
                  :label="user.full_name"
                  :value="`user:${user.id}`"/>
              </el-option-group>

            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('modules.mails.send.subject')"
            prop="subject">

            <el-input
              v-model="mail.subject"
              :disabled="sending"
              maxlength="255"/>

          </el-form-item>

          <el-form-item
            :label="$t('modules.mails.send.attachments')"
            prop="attachments">

            <span class="modules-mails-send--attachements">

              <attachement-item
                v-for="attachment in mail.attachments"
                :key="attachment"
                :id="attachment"
                @remove="removeAttachment"/>

            </span>

            <span class="modules-mails-send--attachment-upload">
              <upload-file-button
                :disabled="sending"
                :max-upload-size="5000000"
                @uploaded="fileUploaded"/>
            </span>

          </el-form-item>

        </div>
        <div class="modules-mails-send--content-form">

          <el-form-item
            prop="content"
            class="modules-mails-send--flex-editor-box">

            <editor
              :value="mail.content"
              :disabled="sending"
              has-min-height
              @input="mailContentChanged"/>

          </el-form-item>

        </div>
      </el-form>

    </el-card>

  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import HeaderToolbar from '~/components/modules/mails/send/headerToolbar'
import uploadFileButton from '~/components/modules/media/uploadFileButton'
import editor from '~/components/editor'
import fetch from '~/utils/fetch'
import attachementItem from './-attachmentItem'

export default {
  components: {
    HeaderToolbar,
    editor,
    uploadFileButton,
    attachementItem
  },

  async fetch ({ store, params }) {
    await store.dispatch('modules/mails/lists/GetLists')
    await store.dispatch('administration/users/GetUsers')
  },

  data () {
    return {
      rules: {
        to: [
          { required: true, message: this.$t('validation.modules-mails-send--to.required'), trigger: 'change' }
        ],
        subject: [
          { required: true, message: this.$t('validation.modules-mails-send--subject.required'), trigger: 'blur' }
        ],
        content: [
          { required: true, message: this.$t('validation.modules-mails-send--content.required'), trigger: 'blur' }
        ]
      },
      mail: {
        to: [],
        subject: null,
        content: null,
        attachments: []
      },
      sending: false
    }
  },

  computed: {
    lists () {
      return _.orderBy(this.$store.getters['modules/mails/lists/list'], 'name')
    },
    users () {
      return _.orderBy(this.$store.getters['administration/users/list'], 'full_name')
    }
  },

  methods: {
    mailContentChanged ({ html }) {
      this.mail.content = html
    },

    async fileUploaded (file) {
      this.mail.attachments.push(file.id)
    },

    removeAttachment (id) {
      if (this.sending) return
      let index = this.mail.attachments.findIndex(a => a === id)

      this.mail.attachments.splice(index, 1)
    },

    async sendMail () {
      await this.$refs['form'].validate()

      this.sending = true
      let backgroundTask = await this._startBackgroundTask()

      let formdata = {
        to: this.mail.to,
        subject: this.mail.subject,
        content: this.mail.content,
        attachments: this.mail.attachments
      }

      let sendMail = fetch({
        url: `/modules/mails/send`,
        method: 'post',
        data: formdata
      })

      await Promise.all([sendMail, this.$timeout(3000)])

      await this._completeBackgroundTask(backgroundTask)

      // Reset mail to default
      this.sending = false
      this.mail = {
        to: [],
        subject: null,
        content: null,
        attachments: []
      }
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },

    async _startBackgroundTask () {
      return this.$store.dispatch('ui/addBackgroundTask', {
        type: 'mail-sending',
        name: 'mail-sending'
      })
    },

    async _completeBackgroundTask (task) {
      this.$store.dispatch('ui/updateBackgroundTask', {
        ...task,
        name: 'mail-delivered',
        progress: 100
      })

      setTimeout(() => {
        this.$store.dispatch('ui/removeBackgroundTask', task)
      }, 3000)
    }
  }
}
</script>
