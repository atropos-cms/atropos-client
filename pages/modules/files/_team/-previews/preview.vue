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

          <image-preview
            v-if="previewImage"
            :preview-src="previewSrc"/>

          <audio-preview 
            v-if="previewAudio"
            :file="selection"/>
            
        </transition>
      </div>

    </el-collapse-item>
  </el-collapse-transition>
</template>

<script type="text/babel">
import audioPreview from './audio'
import imagePreview from './image'
import UsesFileMimetype from '~/mixins/usesFileMimetype'

export default {
  components: {
    audioPreview,
    imagePreview,
  },

  mixins: [UsesFileMimetype],

  props: {
    selection: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  computed: {
    hasPreview () {
      if (this.selection.status !== 'ready') return false
      return (this.selection.has_preview && this.previewImage) || this.previewAudio
    },
    previewSrc () {
      if (!this.hasPreview) return null
      return this.selection.preview
    },
    previewType () {
      return this.nameFromMimetype(this.selection.mime_type)
    },
    previewImage () {
      return this.previewType === 'image' || this.previewType === 'pdf'
    },
    previewAudio () {
      return this.previewType === 'audio'
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