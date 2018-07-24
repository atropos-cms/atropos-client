<template lang="html">
  <div>
    <el-form
      label-position="top"
      label-width="100px">

      <el-form-item :label="$t('general.id')">

        <copy-input :value="gallery.id"/>

      </el-form-item>

      <el-form-item :label="$t('modules.content.galleries.created_at')">
        <el-date-picker
          v-model="created_at"
          :picker-options="{firstDayOfWeek: 1}"
          :clearable="false"
          type="datetime"
          align="center"
          @input="galleryChanged"/>
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
    gallery: {
      type: Object,
      required: true
    }
  },

  computed: {
    created_at: {
      get () {
        return this.gallery.created_at ? new Date(this.gallery.created_at) : null
      },
      set (value) {
        this.gallery.created_at = value
      }
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
