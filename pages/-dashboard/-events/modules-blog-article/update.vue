<template lang="html">
  <div>

    <el-card shadow="never">
      <template slot="header">
        <i class="material-icons text-regular">subject</i>
        <span>{{ $t('modules.blog.articles.article') }}</span>
      </template>

      <span>{{ $t('events.modules-blog-article.update', {owner: owner.full_name}) }}</span>

      <nuxt-link
        v-if="$can('modules-blog-articles')"
        :to="{ name: 'modules-blog-articles-id', params: { id: event.entity_id }}">
        "{{ articleTitle }}"
      </nuxt-link>
      <span v-else>
        "{{ articleTitle }}"
      </span>

    </el-card>

  </div>
</template>

<script type="text/babel">
import eventMixin from '../eventMixin.js'

export default {
  mixins: [eventMixin],

  props: {
    event: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },

  computed: {
    articleTitle () {
      return this.event.content && this.event.content.title
    }
  }
}
</script>
