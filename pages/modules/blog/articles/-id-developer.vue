<template lang="html">
  <div>
    <el-form
      label-position="top"
      label-width="100px">

      <el-form-item :label="$t('general.id')">

        <copy-input :value="articleCopy.id"/>

      </el-form-item>

      <el-form-item :label="$t('modules.blog.articles.created_at')">
        <el-date-picker
          v-model="created_at"
          :picker-options="{firstDayOfWeek: 1}"
          :clearable="false"
          type="datetime"
          align="center"
          @input="articleChanged"/>
      </el-form-item>

    </el-form>
  </div>
</template>

<script type="text/babel">
import copyInput from '~/components/copyInput'

export default {
  components: {
    copyInput
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
    created_at: {
      get () {
        return this.articleCopy.created_at ? new Date(this.articleCopy.created_at) : null
      },
      set (value) {
        this.articleCopy.created_at = value
      }
    }
  },

  methods: {
    articleChanged () {
      this.$emit('update:article', this.articleCopy)
      this.$emit('article-changed')
    }
  }
}
</script>
