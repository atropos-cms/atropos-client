<template>
  <span 
    v-loading="loading" 
    style="flex: 1;">
    <div
      v-if="url"   
      class="preview-audio-player">

      <vue-plyr
        ref="player"
        :options="playerOptions"
        :emit="['canplay']"
        @canplay="canplay">
        <audio
          :src="url"
          :type="file.mime_type" />
      </vue-plyr>

    </div>
  </span>  
</template>

<script type="text/babel">
import downloadObject from '~/components/modules/files/objects/downloadObject'

// import VuePlyr component
const VuePlyr = async () => {
  let {VuePlyr} = await import('vue-plyr')
  return VuePlyr
}

export default {
  mixins: [downloadObject],

  components: {
    'vue-plyr': VuePlyr
  },

  props: {
    file: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },

  data () {
    return {
      url: null,
      loading: true,
      playerOptions: {
        controls: ['play-large', 'play', 'progress', 'current-time']
      }
    }
  },

  computed: {
    fileId () {
      return this.file.id
    }
  },

  watch: {
    async fileId () {
      // every time the selected file changes, reload the file
      await this.fetchAudio()
    }
  },

  async mounted () {
    // don't load the preview on the server
    if (process.server) return

    await this.fetchAudio()
  },

  methods: {
    async fetchAudio () {
      // reset file url
      this.url = null
  
      try {
        // request a download token of type preview
        let { token } = await this.waitForDownloadToken(this.file.id, 'preview')
        if (!token || !token.url) return

        // grab the url from the token
        this.url = token.url
      } catch (e) {}
    },
    async canplay () {
      this.loading = false
    }
  }
}
</script>
