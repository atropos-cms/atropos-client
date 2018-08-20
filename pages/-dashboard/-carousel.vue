<template lang="html">
  <transition name="fade">
    <el-card
      :body-style="{padding: 0}"
      class="box-card">

      <el-carousel
        :initial-index="initialIndex"
        :interval="5000">

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
      slideshow: [{
        title: this.$t('dashboard.welcome.atropos'),
        img: '/images/backgrounds/release-image.jpeg'
      }]
    }
  },

  computed: {
    files () {
      return this.$store.getters['modules/media/browser/files'].filter(i => !!i.r[1200])
    }
  },

  async mounted () {
    // don't enable the slideshow on the server
    if (process.server) return

    // don't load files if the user does not have permission
    if (!this.$can('modules-media-browser')) return

    await this.$store.dispatch('modules/media/browser/GetFiles')

    // if there are still no more than 10 images, just show the promotion image
    if (this.files.length < 10) return

    // otherwise create a slideshow
    try {
      this.createSlideshow()
    } catch (e) {}
  },

  methods: {
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
      this.slideshow = this.slideshow.concat(additionalImages)

      // set the initial index to 1,
      // so we dont start on the promotion slide
      this.initialIndex = 1
    }
  }
}
</script>
