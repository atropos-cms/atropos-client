<template lang="html">
  <span>

    <portal to="toolbar">
      <el-button
        type="primary"
        @click="openCreateCategoryDialog">
        <span>{{ $t('general.create') }}</span>
      </el-button>
    </portal>

    <!-- Create Category Dialog -->
    <el-dialog
      :title="$t('modules.blog.categories.create-new-category')"
      :visible.sync="showCreateCategoryDialog"
      :close-on-click-modal="false">

      <el-form
        ref="form"
        :model="categoryCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="createCategory">

        <el-form-item
          :label="$t('message.modules-blog-categories-create-category')"
          prop="title">
          <el-input
            ref="input"
            v-model="categoryCopy.title"/>
        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="closeCreateCategoryDialog">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="createCategory">
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
      showCreateCategoryDialog: false,
      categoryCopy: { title: '' },
      rules: {
        title: [
          { required: true, message: this.$t('validation.title.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    openCreateCategoryDialog () {
      this.showCreateCategoryDialog = true
      this.$nextTick(() => this.$refs.input.focus())
    },
    closeCreateCategoryDialog () {
      this.showCreateCategoryDialog = false
      this.loading = false
      this.categoryCopy = { title: '' }
    },
    async createCategory () {
      await this.$refs.form.validate()

      this.loading = true
      let category = await this.$store.dispatch('modules/blog/categories/CreateCategory', this.categoryCopy)
      this.loading = false
      this.closeCreateCategoryDialog()
      this.$router.push({ name: 'modules-blog-categories-id', params: { id: category.id } })
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
