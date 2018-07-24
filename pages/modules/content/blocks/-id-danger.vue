<template lang="html">
  <div>

    <el-card class="box-card --danger">

      <b>{{ $t('modules.content.blocks.delete-block') }}</b>
      <p>{{ $t('message.modules-content-blocks-delete-block') }}</p>

      <el-button
        type="danger"
        @click="deleteBlock">
        {{ $t('modules.content.blocks.delete-block') }}
      </el-button>

    </el-card>

  </div>
</template>

<script type="text/babel">
export default {
  props: {
    block: {
      type: Object,
      required: true
    }
  },

  methods: {
    async deleteBlock () {
      await this.$confirm(this.$t('message.modules-content-blocks-delete-block'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('modules/content/blocks/DeleteBlock', this.block)
      await this.$router.push({ name: 'modules-content-blocks' })

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    }
  }
}
</script>
