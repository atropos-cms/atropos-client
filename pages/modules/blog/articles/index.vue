<template lang="html">
  <div>
    <header-toolbar />

    <no-content
      v-if="!articlesCount"
      :text="$t('modules.blog.articles.no-article')"
      illustration="290"/>

    <index-filter v-if="articlesCount"/>

    <div
      v-if="articlesCount"
      class="modules-blog-articles--list">

      <el-row

        :gutter="20"
        align="top"
        type="flex" >

        <articleListItem
          v-for="article in articles.list"
          :key="article.id"
          :article="article"
        />

      </el-row>

      <div class="--flex-justify-center">
        <el-pagination
          v-if="articles.total > pagination.pageSize"
          :total="articles.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          background
          layout="prev, pager, next"
          @current-change="paginationChanged"/>
      </div>

    </div>
  </div>
</template>

<script type="text/babel">
import NoContent from '~/components/noContent'
import ArticleListItem from './-index-articleListItem'
import HeaderToolbar from '~/components/modules/blog/articles/headerToolbar'
import IndexFilter from '~/components/modules/blog/articles/indexFilter'

export default {
  components: {
    NoContent,
    ArticleListItem,
    HeaderToolbar,
    IndexFilter
  },

  async fetch ({ store }) {
    await store.dispatch('modules/blog/articles/GetArticles')
  },

  computed: {
    articles () {
      return this.$store.getters['modules/blog/articles/paginatedList']
    },
    articlesCount () {
      return this.$store.getters['modules/blog/articles/count']
    },
    pagination () {
      return this.$store.getters['modules/blog/articles/pagination']
    }
  },
  methods: {
    paginationChanged (currentPage) {
      this.$store.dispatch('modules/blog/articles/UpdatePagination', Object.assign({}, this.pagination, { currentPage }))
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
