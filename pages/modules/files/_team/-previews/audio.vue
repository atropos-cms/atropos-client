<template>
  <div 
    v-if="url"
    class="preview-audio-player">

    <vue-plyr
      :options="playerOptions">
      <audio :src="url" :type="file.mime_type" />
    </vue-plyr>

  </div>
</template>

<script type="text/babel">
import 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'
import downloadObject from '~/components/modules/files/objects/downloadObject'

export default {
  props: {
    file: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  mixins: [downloadObject],

  data () {
    return {
      url: null,
      playerOptions: {
        controls: ['play-large', 'play', 'progress', 'current-time']
      }
    }
  },

  async mounted () {
    await this.fetchAudio()
  },

  computed: {
    fileId () {
      return this.file.id
    }
  },

  methods: {
    async fetchAudio () {
      // reset file url
      this.url = null

      try {
        // request a download token of type preview
        let {token} = await this.waitForDownloadToken(this.file.id, 'preview')
        if (!token || !token.url) return

        // grab the url from the token
        this.url = token.url
      } catch (e) {}

    }
  },

  watch: {
    async fileId () {
      // every time the selected file changes, reload the file
      await this.fetchAudio()
    }
  }
}
</script>