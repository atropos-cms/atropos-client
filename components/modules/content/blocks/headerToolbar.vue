<template lang="html">
  <span>

    <portal to="toolbar">

      <el-button
        v-popover:instructionsWizzard
        type="primary"
        @click="openCreateBlockDialog">
        <span>{{ $t('general.create') }}</span>
      </el-button>

      <el-popover
        ref="instructionsWizzard"
        :value="showHelpTooltip"
        :title="$t('help.modules.content.blocks.create-fist-block-title')"
        :content="$t('help.modules.content.blocks.create-fist-block-content')"
        placement="bottom"
        width="400"
        trigger="manual"
        popper-class="--text-align-center"/>
    </portal>

    <!-- Create Block Dialog -->
    <el-dialog
      :title="$t('modules.content.blocks.create-new-block')"
      :visible.sync="showCreateBlockDialog"
      :close-on-click-modal="false">

      <el-form
        ref="form"
        :model="blockCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="createBlock">

        <el-form-item
          :label="$t('message.modules-content-blocks-create-block')"
          prop="title">
          <el-input
            ref="input"
            v-model="blockCopy.title"/>
        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeCreateBlockDialog">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="createBlock">
          {{ $t('general.ok') }}
        </el-button>

      </span>
    </el-dialog>

  </span>
</template>

<script type="text/babel">
export default {
  data () {
    return {
      loading: false,
      showHelpTooltip: false,
      showCreateBlockDialog: false,
      blockCopy: { title: '' },
      rules: {
        title: [
          { required: true, message: this.$t('validation.title.required'), trigger: 'change' }
        ]
      }
    }
  },

  async mounted () {
    let list = this.$store.getters['modules/content/blocks/list']

    if (list.length > 0) return

    await this.$timeout(800)

    this.showHelpTooltip = true
  },

  methods: {
    openCreateBlockDialog () {
      this.showCreateBlockDialog = true
      this.$nextTick(() => this.$refs.input.focus())
    },
    closeCreateBlockDialog () {
      this.showCreateBlockDialog = false
      this.loading = false
      this.blockCopy = { title: '' }
    },
    async createBlock () {
      await this.$refs.form.validate()

      this.loading = true
      let block = await this.$store.dispatch('modules/content/blocks/CreateBlock', this.blockCopy)
      this.loading = false
      this.closeCreateBlockDialog()
      this.$router.push({ name: 'modules-content-blocks-id', params: { id: block.id } })
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
