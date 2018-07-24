<template lang="html">
  <div>

    <el-card class="box-card --danger">

      <b>{{ $t('modules.blog.articles.delete-article') }}</b>
      <p>{{ $t('message.modules-blog-articles-delete-article') }}</p>

      <el-button
        type="danger"
        @click="deleteArticle">
        {{ $t('modules.blog.articles.delete-article') }}
      </el-button>

    </el-card>

  </div>
</template>

<script type="text/babel">
export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      articleCopy: this.article
    }
  },

  methods: {
    async deleteArticle () {
      await this.$confirm(this.$t('message.modules-blog-articles-delete-article'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('modules/blog/articles/DeleteArticle', this.articleCopy)
      await this.$router.push({ name: 'modules-blog-articles' })

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    }
  }
}
</script>
