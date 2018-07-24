<template lang="html">
  <div>

    <el-card class="box-card --danger">

      <b>{{ $t('modules.media.files.delete-file') }}</b>
      <p>{{ $t('message.modules-media-files-delete-file') }}</p>

      <el-button
        type="danger"
        @click="deleteFile">
        {{ $t('modules.media.files.delete-file') }}
      </el-button>

    </el-card>

  </div>
</template>

<script type="text/babel">
export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },

  methods: {
    async deleteFile () {
      await this.$confirm(this.$t('message.modules-media-files-delete-file'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('modules/media/browser/DeleteFile', this.file)
      await this.$router.push({ name: 'modules-media-files' })

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    }
  }
}
</script>
