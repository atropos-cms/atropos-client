<template lang="html">
  <el-col
    :xs="12"
    :sm="8"
    :md="6"
    :lg="6"
    :xl="5">
    <nuxt-link
      :to="{name: 'modules-content-galleries-id', params: {id: gallery.id}}"
      class="modules-content-gallery--link">

      <div class="modules-content-gallery--wrapper">
        <div class="modules-content-gallery--image-wapper">
          <img
            v-if="hasAdditionalImages"
            :src="imageSrcSecondary"
            draggable="false"
            class="modules-content-gallery--image-pre">
          <img
            v-if="hasAdditionalImages"
            :src="imageSrcTertiary"
            draggable="false"
            class="modules-content-gallery--image-after">
          <img
            :src="imageSrc"
            draggable="false"
            class="modules-content-gallery--image">

          <div class="modules-content-gallery--image-overlay-hover"/>

          <div class="modules-content-gallery--image-overlay">
            <div class="published-highlight">
              <publish-status-icon :published="gallery.published"/>
            </div>

            <div class="hover-highlight">
              {{ $tc('modules.content.galleries.image-count', gallery.imageCount, {count: gallery.imageCount}) }}
            </div>
          </div>

        </div>

        <div class="modules-content-gallery--name">
          {{ gallery.title }}
        </div>
      </div>

    </nuxt-link>
  </el-col>
</template>

<script type="text/babel">
import { ElementMixin } from 'vue-slicksort'
import PublishStatusIcon from '~/components/publishStatusIcon'

export default {

  components: {
    PublishStatusIcon
  },
  mixins: [ElementMixin],
  props: {
    id: {
      type: String,
      require: true,
      default: null
    }
  },

  computed: {
    gallery () {
      return this.$store.getters['modules/content/galleries/get'](this.id)
    },
    image () {
      if (!this.gallery.cover) return
      return this.$store.getters['modules/media/browser/file'](this.gallery.cover.primary)
    },
    imageSrc () {
      if (!this.image) return
      return this.image.s[300]
    },
    hasAdditionalImages () {
      return this.gallery.cover && this.gallery.cover.secondary && this.gallery.cover.tertiary
    },
    imageSrcSecondary () {
      let secondary = this.$store.getters['modules/media/browser/file'](this.gallery.cover.secondary)
      if (!secondary) return
      return secondary.s[50] || secondary.s[300]
    },
    imageSrcTertiary () {
      let tertiary = this.$store.getters['modules/media/browser/file'](this.gallery.cover.tertiary)
      if (!tertiary) return
      return tertiary.s[50] || tertiary.s[300]
    }
  }
}
</script>
