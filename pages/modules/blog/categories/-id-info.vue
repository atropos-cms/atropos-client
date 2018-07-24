<template lang="html">
  <div class="modules-blog-categories--info-articles-list">
    <b v-if="articles.length">{{ $t('modules.blog.categories.used-in-these-articles') }}:</b>

    <div
      v-for="article in articles"
      :key="article.id"
      class="modules-blog-categories--info-articles-item">

      <nuxt-link :to="{ name: 'modules-blog-articles-id', params: { id: article.id }}">
        <el-button type="text">{{ article.title }}</el-button>
      </nuxt-link>

    </div>

  </div>
</template>

<script type="text/babel">

export default {
  props: {
    category: {
      type: Object,
      required: true
    }
  },

  computed: {
    articles () {
      let articles = this.$store.getters['modules/blog/articles/list']
      if (!articles) return []
      return articles.filter(article => article.categories.includes(this.category.id))
    }
  },

  async mounted () {
    await this.$store.dispatch('modules/blog/articles/GetArticles')
  }
}
</script>
