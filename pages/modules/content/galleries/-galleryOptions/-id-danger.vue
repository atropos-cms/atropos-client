<template lang="html">
  <div>

    <el-card class="box-card --danger">

      <b>{{ $t('modules.content.galleries.delete-gallery') }}</b>
      <p>{{ $t('message.modules-content-galleries-delete-gallery') }}</p>

      <el-button
        type="danger"
        @click="deleteGallery">
        {{ $t('modules.content.galleries.delete-gallery') }}
      </el-button>

    </el-card>

  </div>
</template>

<script type="text/babel">
export default {
  props: {
    gallery: {
      type: Object,
      required: true
    }
  },

  methods: {
    async deleteGallery () {
      await this.$confirm(this.$t('message.modules-content-galleries-delete-gallery'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('modules/content/galleries/DeleteGallery', this.gallery)
      await this.$router.push({ name: 'modules-content-galleries' })

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    }
  }
}
</script>
