<template lang="html">
  <div>

    <header-toolbar />

    <el-table
      ref="categoriesTable"
      :data="categories"
      style="width: 100%"
      stripe>

      <el-table-column
        :label="$t('modules.blog.categories.title')"
        sortable
        prop="title"
        min-width="200"/>

      <el-table-column
        :label="$t('modules.blog.categories.last_updated')"
        property="updated_at"
        min-width="200"
        sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.updated_at">
            {{ scope.row.updated_at | moment("from") }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        width="80"
        align="right">
        <template slot-scope="scope">

          <nuxt-link :to="{ name: 'modules-blog-categories-id', params: { id: scope.row.id }}">
            <el-button size="small">
              <i class="material-icons">edit</i>
            </el-button>
          </nuxt-link>

        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script type="text/babel">
import CategoryListItem from './-index-categoryListItem'
import HeaderToolbar from '~/components/modules/blog/categories/headerToolbar'

export default {
  layout: 'boxed',

  components: {
    CategoryListItem,
    HeaderToolbar
  },

  async fetch ({ store }) {
    await store.dispatch('modules/blog/categories/GetCategories')
  },

  computed: {
    categories () {
      return this.$store.getters['modules/blog/categories/list']
    }
  },

  methods: {
    handleCommand ({ command, data }) {
      switch (command) {
        case 'edit':
          return this.editCategory(data)
        case 'delete':
          return this.deleteCategory(data)
      }
    },
    async editCategory (category) {
      this.$router.push(`/modules/blog/categories/${category.id}`)
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
