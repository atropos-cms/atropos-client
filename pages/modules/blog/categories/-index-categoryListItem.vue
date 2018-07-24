<template lang="html">
  <el-card
    :body-style="{padding: '10px'}"
    class="box-card modules-blog-categories--list-item">

    <el-row
      :gutter="20"
      align="middle"
      type="flex">

      <el-col :span="16">{{ category.title }}</el-col>

      <el-col :span="6">
        <span class="text-secondary">
          {{ category.updated_at | moment("from") }}
        </span>
      </el-col>

      <el-col
        :span="2"
        class="modules-blog-categories--list-item-action-col">
        <nuxt-link :to="{ name: 'modules-blog-categories-id', params: { id: category.id }}">
          <el-button size="small">
            <i class="material-icons">edit</i>
          </el-button>
        </nuxt-link>
      </el-col>

    </el-row>
  </el-card>
</template>

<script type="text/babel">
import moment from 'moment'
import User from '~/components/user'

export default {
  components: {
    User
  },

  props: {
    category: {
      type: Object,
      require: true,
      default () {
        return {}
      }
    }
  },

  computed: {
    isDraft () {
      return this.category.published_at === null
    },
    isPublished () {
      if (this.isDraft) return false
      return moment(this.category.published_at).isBefore()
    },
    isScheduled () {
      if (this.isDraft) return false
      return moment(this.category.published_at).isAfter()
    },
    categoryStatus () {
      if (this.isDraft) return 'draft'
      if (this.isPublished) return 'published'
      if (this.isScheduled) return 'scheduled'
    }
  }
}
</script>
