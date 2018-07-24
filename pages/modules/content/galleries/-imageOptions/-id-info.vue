<template lang="html">
  <div>
    <el-form
      label-position="left"
      label-width="100px">

      <el-form-item :label="$t('modules.content.galleries.published')">
        <el-switch
          v-model="gallery.published"
          @input="galleryChanged"/>
      </el-form-item>

      <el-form-item :label="$t('modules.content.galleries.author')">
        <user-select
          v-model="gallery.author_id"
          @input="galleryChanged"/>
      </el-form-item>

    </el-form>
  </div>
</template>

<script type="text/babel">
import userSelect from '~/components/userSelect'
import categoriesSelect from '~/components/modules/blog/categories/categoriesSelect'

export default {
  components: {
    userSelect,
    categoriesSelect
  },

  props: {
    gallery: {
      type: Object,
      required: true
    }
  },

  methods: {
    galleryChanged () {
      this.$emit('update:gallery', this.gallery)
      this.$emit('gallery-changed')
    }
  }
}
</script>
