<template lang="html">
  <div>
    <el-form
      label-position="top"
      label-width="100px">

      <el-form-item :label="$t('modules.blog.articles.published_at')">
        <el-date-picker
          v-model="published_at"
          :picker-options="{disabledDate: publishDateIsDisabled, firstDayOfWeek: 1}"
          type="datetime"
          align="center"
          @input="articleChanged"/>
      </el-form-item>

      <el-form-item :label="$t('modules.blog.articles.event_at')">
        <el-date-picker
          v-model="event_at"
          :picker-options="{firstDayOfWeek: 1}"
          type="datetime"
          align="center"
          @input="articleChanged"/>
      </el-form-item>

      <el-form-item :label="$t('modules.blog.articles.author')">
        <user-select
          v-model="articleCopy.author_id"
          @input="articleChanged"/>
      </el-form-item>

      <el-form-item :label="$t('modules.blog.categories.categories')">
        <categories-select
          v-model="articleCopy.categories"
          @input="articleChanged"/>
      </el-form-item>

    </el-form>
  </div>
</template>

<script type="text/babel">
import moment from 'moment'
import userSelect from '~/components/userSelect'
import categoriesSelect from '~/components/modules/blog/categories/categoriesSelect'

export default {
  components: {
    userSelect,
    categoriesSelect
  },

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

  computed: {
    published_at: {
      get () {
        return this.articleCopy.published_at ? new Date(this.articleCopy.published_at) : null
      },
      set (value) {
        this.articleCopy.published_at = value
      }
    },
    event_at: {
      get () {
        return this.articleCopy.event_at ? new Date(this.articleCopy.event_at) : null
      },
      set (value) {
        this.articleCopy.event_at = value
      }
    }
  },

  methods: {
    articleChanged () {
      this.$emit('update:article', this.articleCopy)
      this.$emit('article-changed')
    },

    publishDateIsDisabled (date) {
      if (this.$setting('developer_mode')) return false
      return moment(date).isBefore(this.articleCopy.created_at)
    }
  }
}
</script>
