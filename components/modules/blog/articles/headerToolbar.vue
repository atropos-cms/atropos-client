<template lang="html">
  <span>

    <portal to="toolbar">

      <div class="page-header--toolbar-options">
        <el-button
          type="text"
          @click="toggleFilters">
          <i class="material-icons">search</i>
        </el-button>
      </div>

      <el-button
        v-popover:instructionsWizzard
        type="primary"
        @click="openCreateArticleDialog">
        <span>{{ $t('general.create') }}</span>
      </el-button>

      <el-popover
        ref="instructionsWizzard"
        :value="showHelpTooltip"
        :title="$t('help.modules.blog.articles.create-fist-article-title')"
        :content="$t('help.modules.blog.articles.create-fist-article-content')"
        placement="bottom"
        width="400"
        trigger="manual"
        popper-class="--text-align-center"/>
    </portal>

    <!-- Create Article Dialog -->
    <el-dialog
      :title="$t('modules.blog.articles.create-new-article')"
      :visible.sync="showCreateArticleDialog"
      :close-on-click-modal="false">

      <el-form
        ref="form"
        :model="articleCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="createArticle">

        <el-form-item
          :label="$t('message.modules-blog-articles-create-article')"
          prop="title">
          <el-input
            ref="input"
            v-model="articleCopy.title"/>
        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeCreateArticleDialog">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="createArticle">
          {{ $t('general.ok') }}
        </el-button>

      </span>
    </el-dialog>

  </span>
</template>

<script type="text/babel">
import togglesPageFilter from '~/mixins/togglesPageFilter'

export default {
  mixins: [togglesPageFilter],

  data () {
    return {
      loading: false,
      showHelpTooltip: false,
      showCreateArticleDialog: false,
      articleCopy: {title: ''},
      rules: {
        title: [
          { required: true, message: this.$t('validation.title.required'), trigger: 'change' }
        ]
      }
    }
  },

  async mounted () {
    let count = this.$store.getters['modules/blog/articles/count']

    if (count > 0) return

    await this.$timeout(800)

    this.showHelpTooltip = true
  },

  methods: {
    openCreateArticleDialog () {
      this.showCreateArticleDialog = true
      this.$nextTick(() => this.$refs.input.focus())
    },
    closeCreateArticleDialog () {
      this.showCreateArticleDialog = false
      this.loading = false
      this.articleCopy = {title: ''}
    },
    async createArticle () {
      await this.$refs.form.validate()

      this.loading = true
      let article = await this.$store.dispatch('modules/blog/articles/CreateArticle', this.articleCopy)

      this.loading = false

      this.closeCreateArticleDialog()
      this.$router.push({ name: 'modules-blog-articles-id', params: { id: article.id } })
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
