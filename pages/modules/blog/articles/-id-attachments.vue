<template lang="html">
  <div>

    <div class="modules-blog-articles--attachements">
      <attachment-item
        v-for="attachment in attachments"
        :key="attachment"
        :article="article"
        :attachment-id="attachment"
        @remove="removeAttachment"/>
    </div>

    <div class="modules-blog-articles--attachment-upload">

      <upload-file-button
        @uploaded="fileUploaded"/>

    </div>

  </div>
</template>

<script type="text/babel">
import attachmentItem from './-id-attachmentItem'
import uploadFileButton from '~/components/modules/media/uploadFileButton'

export default {

  components: {
    attachmentItem,
    uploadFileButton
  },
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
    attachments () {
      return this.articleCopy.attachments
    }
  },

  methods: {
    removeAttachment (id) {
      this.articleCopy.attachments = this.articleCopy.attachments.filter(a => a !== id)

      this.$emit('update:article', this.articleCopy)
      this.$emit('article-changed')
    },

    async fileUploaded (file) {
      this.articleCopy.attachments.push(file.id)

      this.$emit('update:article', this.articleCopy)
      this.$emit('article-changed')
    }
  }
}
</script>
