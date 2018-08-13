<template lang="html">
  <event-component :event="event">
    <!-- Header -->
    <template slot="event-name">
      <i class="material-icons text-regular">subject</i>
      <span>{{ $t('modules.blog.articles.article') }}</span>
    </template>

    <!-- Content -->
    <span>{{ $t('events.modules-blog-article.new', {owner: owner.full_name}) }}</span>

    <nuxt-link
      v-if="$can('modules-blog-articles')"
      :to="{ name: 'modules-blog-articles-id', params: { id: event.entity_id }}">
      "{{ articleTitle }}"
    </nuxt-link>
    <span v-else>
      "{{ articleTitle }}"
    </span>

  </event-component>
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
