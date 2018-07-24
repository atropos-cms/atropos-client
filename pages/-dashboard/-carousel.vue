<template lang="html">
  <transition name="fade">
    <el-card
      v-if="showCarousel"
      :body-style="{padding: 0}"
      class="box-card">

      <el-carousel
        :initial-index="initialIndex"
        :interval="5000">

        <el-carousel-item
          v-for="(item, index) in carousel"
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
import Random from '~/utils/random'
// const { version } = require('../../package.json')

export default {
  data () {
    return {
      showCarousel: false,
      atropos: {
        title: this.$t('dashboard.welcome.atropos'),
        // subtitle: `v${version} - Changelog`,
        img: '/images/backgrounds/release-image.jpeg'
      }
    }
  },

  computed: {
    carousel () {
      // If we only have 10 images, just show the atropos image
      if (this.files.length < 10) {
        return [this.atropos]
      }

      // Otherwise return an image-of-the-day and some random images
      return [this.atropos, this.imgeOfTheDay, this.random1, this.random2, this.random3]
    },
    initialIndex () {
      if (this.files.length < 10) {
        return 0
      }
      return 1
    },
    imgeOfTheDay () {
      let randomInstance = new Random(moment().utc().dayOfYear())
      let index = randomInstance.next() % this.files.length

      return Object.assign(this.imageFromIndex(index), {
        title: this.$t('dashboard.welcome.image-of-the-day')
      })
    },
    random1 () {
      let randomInstance = new Random(moment().utc().dayOfYear() * 193)
      let index = randomInstance.next() % this.files.length
      return this.imageFromIndex(index)
    },
    random2 () {
      let randomInstance = new Random(moment().utc().dayOfYear() * 149)
      let index = randomInstance.next() % this.files.length
      return this.imageFromIndex(index)
    },
    random3 () {
      let randomInstance = new Random(moment().utc().dayOfYear() * 587)
      let index = randomInstance.next() % this.files.length
      return this.imageFromIndex(index)
    },
    files () {
      return this.$store.getters['modules/media/browser/files'].filter(i => !!i.r[1200])
    }
  },

  async mounted () {
    if (process.server) return
    await this.$timeout(1600)
    this.showCarousel = true
  },

  methods: {
    imageFromIndex (index) {
      let image = this.files[index]

      return {
        img: image.r[1200]
      }
    }
  }
}
</script>
