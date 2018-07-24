<template lang="html">
  <!-- Upload Progress-->
  <div
    v-if="showUploadProgress"
    class="modules-media-browser--upload-in-progress">

    <!-- Preview Image -->
    <el-card
      :body-style="{ padding: '0px' }"
      class="box-card modules-media-browser--upload-preview">

      <i class="material-icons">
        cloud_upload
      </i>

      <transition name="fade">
        <img
          v-show="imageLoaded"
          :src="progress.previewSrc"
          :key="progress.previewSrc"
          draggable="false"
          @load="imageLoaded = true">
      </transition>

    </el-card>

    <el-progress
      v-if="showUploadProgress"
      :text-inside="true"
      :stroke-width="18"
      :percentage="progress.fileProgress"
      class="modules-media-browser--upload-progress"/>

    <span class="text-secondary">{{ progress.done +1 }}/{{ progress.total }}</span>

  </div>
</template>

<script type="text/babel">
export default {
  props: {
    showUploadProgress: {
      type: Boolean,
      require: true,
      default: false
    },
    progress: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },

  data () {
    return {
      imageLoaded: false
    }
  },

  watch: {
    progress: {
      handler (newValue, oldValue) {
        if (newValue.fileProgress >= 95) {
          this.imageLoaded = false
        }
      },
      deep: true
    }
  }
}
</script>
