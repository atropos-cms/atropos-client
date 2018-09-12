<template lang="html">
  <div
    :class="{'--is-drag-over-page': dragIsOverPage}"
    class="app-wrapper"
    @contextmenu="contextMenu">
    <default-aside/>
    <div
      :class="{'logged-in': loggedIn}"
      class="app-container">

      <div
        v-if="shouldShouwBackgroundImage"
        class="app-container--background">

        <transition name="slow-slide-fade">
          <div v-show="backgroundImageLoaded">
            <div class="app-container--background-overlay"/>
            <img
              class="app-container--background-image"
              src="/images/backgrounds/release-image.jpeg"
              @load="backgroundImageLoaded = true">
          </div>

        </transition>

      </div>

      <default-header/>
      <el-main
        id="app-content"
        :class="{'logged-in': loggedIn}"
        class="app-content">

        <div
          v-bar
          class="app-scrollbar-container">
          <div class="app-scrollbar-view">
            <slot/>
          </div>
        </div>

      </el-main>
    </div>

    <!-- Components -->
    <background-tasks/>
    <media-browser
      v-if="loggedIn && $can('modules-media-browser')"/>

  </div>
</template>

<script type="text/babel">
import acceptGdpr from './_app/acceptGdpr'
import DefaultAside from './_app/Aside'
import DefaultHeader from './_app/Header'
import BackgroundTasks from './components/BackgroundTasks'
import serviceOfflineNotification from '~/mixins/serviceOfflineNotification'
import mediaBrowser from '~/components/modules/media/browser'

export default {
  name: 'App',

  components: {
    DefaultAside,
    DefaultHeader,
    BackgroundTasks,
    mediaBrowser
  },

  mixins: [acceptGdpr, serviceOfflineNotification],

  data () {
    return {
      dragIsOverPage: false,
      dragTimerInstance: null,
      backgroundImageLoaded: false
    }
  },

  computed: {
    loggedIn () {
      return this.$store.getters['profile/loggedIn']
    },
    routeMeta () {
      return this.$store.getters['routeMeta']
    },
    shouldShouwBackgroundImage () {
      if (this.routeMeta && this.routeMeta.layout) {
        return this.routeMeta.layout.background
      }

      return !this.loggedIn
    }
  },

  mounted () {
    window.addEventListener('drop', this.drop, false)
    window.addEventListener('dragover', this.dragover, false)
    document.addEventListener('dragleave', this.dragleave)
  },

  methods: {
    contextMenu (event) {
      if (event.target instanceof HTMLInputElement) return true
      if (event.target.contentEditable === 'true') return true

      if (event.target.contentEditable === 'inherit') {
        if (event.target.parentNode.contentEditable === 'true') return true
      }

      event.preventDefault()
      return false
    },

    drop (event) {
      this.dragleave()
      event.preventDefault()
      return false
    },
    dragover (event) {
      this.dragIsOverPage = true

      clearTimeout(this.dragTimerInstance)
      this.dragTimerInstance = null

      event.preventDefault()
      return false
    },
    dragleave () {
      if (this.dragTimerInstance) return
      this.dragTimerInstance = setTimeout(() => { this.dragIsOverPage = false }, 100)
    }
  }
}
</script>
