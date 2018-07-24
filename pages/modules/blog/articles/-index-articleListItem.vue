<template lang="html">
  <el-col
    :sm="12"
    :md="8"
    :lg="6"
    :xl="6">

    <nuxt-link
      :to="{ name: 'modules-blog-articles-id', params: { id: article.id }}"
      class="modules-blog-articles--list-item-link">

      <el-card
        :body-style="{ padding: '0px' }"
        class="box-card modules-blog-articles--list-item">

        <div class="post-image">
          <div
            v-if="!hasImage"
            class="post-image--icon">
            <i class="material-icons">insert_photo</i>
          </div>

          <img
            v-if="hasImage"
            :src="imageSrc"
            draggable="false"
            class="post-image--image">
        </div>

        <div
          class="post-info"
          style="padding: 14px;">
          <span class="post-title">{{ article.title }}</span>

          <div class="bottom clearfix">
            <publish-status-icon
              :published-at="article.published_at"
              label-placement="left"/>

            <div>
              <time class="text-secondary">{{ article.updated_at | moment("from") }}</time>
            </div>

            <span class="text-secondary">
              <user :id="article.author_id"/>
            </span>
          </div>
        </div>

      </el-card>
    </nuxt-link>

  </el-col>
</template>

<script type="text/babel">
import moment from 'moment'
import User from '~/components/user'
import PublishStatusIcon from '~/components/publishStatusIcon'

export default {
  components: {
    User,
    PublishStatusIcon
  },

  props: {
    article: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },

  computed: {
    isDraft () {
      return this.article.published_at === null
    },
    isPublished () {
      if (this.isDraft) return false
      return moment(this.article.published_at).isBefore()
    },
    isScheduled () {
      if (this.isDraft) return false
      return moment(this.article.published_at).isAfter()
    },
    articleStatus () {
      if (this.isDraft) return 'draft'
      if (this.isPublished) return 'published'
      if (this.isScheduled) return 'scheduled'
    },
    imageSrc () {
      let image = this.$store.getters['modules/media/browser/file'](this.article.cover_id)
      if (!image) return

      if (image.s[300]) {
        return image.s[300]
      }

      return image.r[300]
    },
    hasImage () {
      return this.article.cover_id && this.imageSrc
    }
  }
}
</script>
