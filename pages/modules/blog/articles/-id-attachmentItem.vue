<template lang="html">
  <el-card
    :body-style="{ padding: '0px' }"
    class="box-card modules-blog-articles--attachement">

    <transition
      name="el-fade-in"
      mode="out-in">

      <div
        v-if="attachment"
        class="modules-blog-articles--attachement-content">

        <div class="modules-blog-articles--attachement-icon">
          <i class="material-icons">{{ icon }}</i>
        </div>

        <span class="text-secondary">{{ attachment.name | truncate(20) }}</span>

      </div>

    </transition>

    <div class="hover-options">
      <el-button
        type="text"
        @click="removeAttachment">
        <i class="material-icons">delete</i>
      </el-button>
    </div>

  </el-card>
</template>

<script type="text/babel">
import UsesFileMimetype from '~/mixins/usesFileMimetype'

export default {
  mixins: [ UsesFileMimetype ],

  props: {
    article: {
      type: Object,
      required: true
    },
    attachmentId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      articleCopy: this.article
    }
  },

  computed: {
    attachment () {
      return this.$store.getters['modules/media/browser/file'](this.attachmentId)
    },
    icon () {
      if (!this.attachment) return
      return this.iconFromMimetype(this.attachment.mime_type)
    }
  },

  methods: {
    removeAttachment () {
      this.$emit('remove', this.attachmentId)
    }
  }
}
</script>
