<template lang="html">
  <span>

    <portal to="toolbar">
      <el-button
        v-popover:instructionsWizzard
        type="primary"
        @click="openCreateGalleryDialog">
        <span>{{ $t('general.create') }}</span>
      </el-button>

      <el-popover
        ref="instructionsWizzard"
        :value="showHelpTooltip"
        :title="$t('help.modules.content.galleries.create-fist-gallery-title')"
        :content="$t('help.modules.content.galleries.create-fist-gallery-content')"
        placement="bottom"
        width="400"
        trigger="manual"
        popper-class="--text-align-center"/>
    </portal>

    <!-- Create Gallery Dialog -->
    <el-dialog
      :title="$t('modules.content.galleries.create-new-gallery')"
      :visible.sync="showCreateGalleryDialog"
      :close-on-click-modal="false">

      <el-form
        ref="form"
        :model="galleryCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="createGallery">

        <el-form-item
          :label="$t('message.modules-content-galleries-create-gallery')"
          prop="title">
          <el-input
            ref="input"
            v-model="galleryCopy.title"/>
        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeCreateGalleryDialog">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="createGallery">
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
      showCreateGalleryDialog: false,
      galleryCopy: { title: '' },
      rules: {
        title: [
          { required: true, message: this.$t('validation.title.required'), trigger: 'change' }
        ]
      }
    }
  },

  async mounted () {
    let list = this.$store.getters['modules/content/galleries/list']

    if (list.length > 0) return

    await this.$timeout(800)

    this.showHelpTooltip = true
  },

  methods: {
    openCreateGalleryDialog () {
      this.showCreateGalleryDialog = true
      this.$nextTick(() => this.$refs.input.focus())
    },
    closeCreateGalleryDialog () {
      this.showCreateGalleryDialog = false
      this.loading = false
      this.galleryCopy = { title: '' }
    },
    async createGallery () {
      await this.$refs.form.validate()

      this.loading = true
      let gallery = await this.$store.dispatch('modules/content/galleries/CreateGallery', this.galleryCopy)
      this.loading = false

      this.$router.push({ name: 'modules-content-galleries-id', params: { id: gallery.id } })

      this.closeCreateGalleryDialog()
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
