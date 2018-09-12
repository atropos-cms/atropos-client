<template lang="html">
  <transition name="fade">
    <el-card
      :body-style="{padding: 0}"
      class="box-card">

      <el-carousel
        ref="carousel"
        :initial-index="initialIndex"
        :interval="slideInterval"
        :autoplay="autoplay">

        <el-carousel-item
          v-for="(item, index) in slideshow"
          :key="index">

          <div
            :style="{backgroundImage: 'url('+item.img+')'}"
            class="carousel-item-content">

            <div class="title-wrapper">
              <h3
                v-if="item.title"
                class="title">
                {{ item.title }}
              </h3>
              <h4
                v-if="item.subtitle"
                class="subtitle">
                {{ item.subtitle }}
              </h4>
            </div>

          </div>

        </el-carousel-item>
      </el-carousel>

    </el-card>
  </transition>
</template>

<script type="text/babel">
import moment from 'moment'
import seededShuffle from 'seededshuffle'

export default {
  data () {
    return {
      initialIndex: 0,
      slideInterval: 5000,
      autoplay: false,
      atroposSlide: {
        title: this.$t('dashboard.welcome.atropos'),
        img: '/images/backgrounds/release-image.jpeg'
      },
      slideshow: []
    }
  },

  computed: {
    files () {
      return this.$store.getters['modules/media/browser/files'].filter(i => !!i.r[1200])
    },
    filesLoaded () {
      return this.$store.getters['modules/media/browser/filesLoaded']
    }
  },

  watch: {
    filesLoaded () {
      this.init()
    }
  },

  async mounted () {
    this.init()
    // if files are already loaded, switch to second image
    if (this.slideshow.length > 1) {
      this.initialIndex = 1
      return
    }

    // otherwise set a timer to check again in 3s
    await this.$timeout(2000)
    this.autoplay = true
    this.$nextTick(() => this.$refs.carousel && this.$refs.carousel.next())
  },

  methods: {
    init () {
      // don't enable the slideshow on the server
      if (process.server) return

      this.slideshow = [this.atroposSlide]

      // don't load files if the user does not have permission
      if (!this.$can('modules-media-browser')) return

      // if there are still no more than 10 images, just show the promotion image
      if (this.files.length < 10) return

      // otherwise create a slideshow
      try {
        this.createSlideshow()
      } catch (e) {}
    },
    createSlideshow () {
      // shuffle all files with the seed of the day
      let randomSeed = moment().format('YYYYMMDD')
      let shuffled = seededShuffle.shuffle(this.files, randomSeed, true)

      // create a new array of images to add to the slideshow
      let additionalImages = [{
        title: this.$t('dashboard.welcome.image-of-the-day'),
        img: shuffled[0].r[1200]
      }, {
        img: shuffled[1].r[1200]
      }, {
        img: shuffled[2].r[1200]
      }, {
        img: shuffled[3].r[1200]
      }, {
        img: shuffled[4].r[1200]
      }]

      // add the images to the slideshow
      this.slideshow = [this.atroposSlide, ...additionalImages]
    }
  }
}
</script>
