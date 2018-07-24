<template lang="html">
  <el-tooltip
    :content="$t('general.status.'+status)"
    :enterable="false"
    :open-delay="1000"
    :placement="labelPlacement"
    popper-class="tooltip-not-enterable"
    effect="dark">
    <div
      v-if="isDraft"
      class="publish-status-icon --is-draft">
      <i class="material-icons">drafts</i>
    </div>
    <div
      v-if="isPublished"
      class="publish-status-icon --is-published">
      <i class="material-icons">public</i>
    </div>
    <div
      v-if="isScheduled"
      class="publish-status-icon --is-scheduled">
      <i class="material-icons">schedule</i>
    </div>
  </el-tooltip>
</template>

<script type="text/babel">
import moment from 'moment'

export default {
  props: {
    publishedAt: {
      type: String,
      require: false,
      default: undefined
    },
    published: {
      type: [Boolean, Number],
      require: false,
      default: undefined
    },
    labelPlacement: {
      type: String,
      default: 'right'
    }
  },

  computed: {
    isDraft () {
      return this.publishedAt === null || this.published === false
    },
    isPublished () {
      if (this.isDraft) return false
      if (this.publishedAt === undefined) return !!this.published
      return moment(this.publishedAt).isBefore()
    },
    isScheduled () {
      if (this.isDraft) return false
      return moment(this.publishedAt).isAfter()
    },
    status () {
      if (this.isDraft) return 'draft'
      if (this.isPublished) return 'published'
      if (this.isScheduled) return 'scheduled'
    }
  }
}
</script>
