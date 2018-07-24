<template lang="html">
  <div>
    <el-form
      ref="form"
      :model="gallery"
      :rules="rules"
      label-position="top"
      label-width="100px">

      <el-form-item
        :label="$t('modules.content.galleries.title')"
        prop="title">
        <el-input
          :placeholder="$t('modules.content.galleries.title')"
          v-model="gallery.title"
          @input="galleryChanged"/>
      </el-form-item>
    </el-form>

    <el-collapse
      v-model="activeName"
      accordion>
      <el-collapse-item
        :title="$t('general.info')"
        name="1">

        <info
          :gallery.sync="gallery"
          @gallery-changed="galleryChanged"/>

      </el-collapse-item>
      <el-collapse-item
        v-if="$setting('developer_mode')"
        :title="$t('general.developer-tools')"
        name="developer">

        <developer
          :gallery.sync="gallery"
          @gallery-changed="galleryChanged"/>

      </el-collapse-item>
      <el-collapse-item
        :title="$t('general.danger-zone')"
        name="2">

        <danger :gallery.sync="gallery"/>

      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script type="text/babel">
import Info from './-id-info'
import Danger from './-id-danger'
import Developer from './-id-developer'

export default {
  components: {
    Info,
    Danger,
    Developer
  },

  props: {
    gallery: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      activeName: '1',
      rules: {
        title: [
          { required: true, message: this.$t('validation.title.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    async galleryChanged () {
      await this.$refs.form.validate()

      this.$emit('update:gallery', this.gallery)
      this.$emit('gallery-changed')
    }
  }
}
</script>
