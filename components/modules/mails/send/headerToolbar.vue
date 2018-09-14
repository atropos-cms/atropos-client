<template lang="html">
  <span>

    <portal to="toolbar">

      <div
        v-if="$can('modules-mails-lists')"
        class="page-header--toolbar-options-separated">

        <el-button
          type="text"
          @click="navigateToLists">
          <i class="material-icons">email</i>
        </el-button>

      </div>

      <el-button
        :loading="sending"
        type="primary"
        @click="sendMail">

        <i
          v-if="!sending"
          class="material-icons el-button-icon">send</i>

        <span>{{ $t('modules.mails.send.send') }}</span>

      </el-button>

    </portal>

  </span>
</template>

<script type="text/babel">
export default {
  props: {
    sending: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      showCreateListDialog: false,
      listCopy: { name: '' }
    }
  },

  methods: {
    navigateToLists () {
      this.$router.push({ name: 'modules-mails-lists' })
    },
    sendMail () {
      this.$emit('sendMail')
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
