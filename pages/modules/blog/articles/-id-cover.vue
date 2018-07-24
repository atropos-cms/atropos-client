<template lang="html">
  <div>
    <el-form
      label-position="top"
      label-width="100px">

      <el-card
        :body-style="{ padding: '0px' }"
        class="box-card modules-blog-articles--cover-image">

        <transition
          name="el-fade-in"
          mode="out-in">
          <div
            v-if="!hasImage"
            class="image-placeholder"
            @click="openMediaBrowser">
            <h4>{{ $t('message.click-here-to-add-a-photo') }}</h4>
          </div>

          <img
            v-if="hasImage"
            :src="imageSrc"
            draggable="false">
        </transition>

        <div
          v-if="hasImage"
          class="hover-options">
          <el-button
            type="text"
            @click="openMediaBrowser">
            <i class="material-icons">add_a_photo</i>
          </el-button>

          <el-button
            type="text"
            @click="removeCover">
            <i class="material-icons">delete</i>
          </el-button>
        </div>

      </el-card>

    </el-form>
  </div>
</template>

<script type="text/babel">
export default {
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
    image () {
      return this.$store.getters['modules/media/browser/file'](this.articleCopy.cover_id)
    },
    imageSrc () {
      if (!this.image) return

      if (this.image.s[300]) {
        return this.image.s[300]
      }

      return this.image.r[300]
    },
    hasImage () {
      return this.articleCopy.cover_id && this.imageSrc
    }
  },

  methods: {
    removeCover () {
      this.articleCopy.cover_id = null
      this.$emit('update:article', this.articleCopy)
      this.$emit('article-changed')
    },
    async openMediaBrowser () {
      let file = await this.$mediaBrowser()
      this.articleCopy.cover_id = null

      await this.$timeout(2)

      this.articleCopy.cover_id = file.id
      this.$emit('update:article', this.articleCopy)
      this.$emit('article-changed')
    }
  }
}
</script>
