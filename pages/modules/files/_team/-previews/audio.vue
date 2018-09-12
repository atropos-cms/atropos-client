<template>
  <div class="preview-audio-player">

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

  methods: {
    async fetchAudio () {
      let {token} = await this.waitForDownloadToken(this.file.id, 'preview')
      this.url = token.url
    }
  }
}
</script>