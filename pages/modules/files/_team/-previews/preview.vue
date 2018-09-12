<template>
  <el-collapse-transition>
    <el-collapse-item
      v-if="hasPreview"
      :title="$t('modules.files.files.preview')"
      name="preview">

      <div class="modules-files-objects--info-preview">
        <transition
          name="el-fade-in"
          mode="out-in">

          <img
            v-if="previewSrc"
            :src="previewSrc"
            draggable="false">
            
        </transition>
      </div>

    </el-collapse-item>
  </el-collapse-transition>
</template>

<script  type="text/babel">
export default {
  props: {
    selection: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  computed: {
    hasPreview () {
      return this.selection.has_preview
    },
    previewSrc () {
      if (!this.hasPreview) return null
      return this.selection.preview
    }
  },

  watch: {
    hasPreview () {
      if (this.hasPreview && this.previewSrc) return
      this.$emit('fetchPreview', {id: this.selectionId})
    }
  }
}
</script>