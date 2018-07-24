<template lang="html">
  <div>

    <el-card class="box-card --danger">

      <b>{{ $t('modules.blog.categories.delete-category') }}</b>
      <p>{{ $t('message.modules-blog-categories-delete-category') }}</p>

      <el-button
        type="danger"
        @click="deleteCategory">
        {{ $t('modules.blog.categories.delete-category') }}
      </el-button>

    </el-card>

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

  data () {
    return {
      categoryCopy: this.category
    }
  },

  methods: {
    async deleteCategory () {
      await this.$confirm(this.$t('message.modules-blog-categories-delete-category'), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.ok'),
        cancelButtonText: this.$t('general.cancel'),
        type: 'warning'
      })

      await this.$store.dispatch('modules/blog/categories/DeleteCategory', this.categoryCopy)
      await this.$router.push({ name: 'modules-blog-categories' })

      this.$message({
        type: 'success',
        message: this.$t('message.record-successfully-deleted')
      })
    }
  }
}
</script>
