<template lang="html">
  <div class="--flex-grow">
    <header-toolbar />

    <no-content
      v-if="!galleries.length"
      :text="$t('modules.content.galleries.no-galleries')"
      illustration="22"/>

    <galleries
      v-else
      :value="galleries"
      :distance="10"
      :lock-to-container-edges="true"
      helper-class="modules-content-gallery--draggable-ghost"
      axis="xy"
      @input="sorted"/>

  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import saveOnInterval from '~/mixins/saveOnInterval'
import NoContent from '~/components/noContent'
import HeaderToolbar from '~/components/modules/content/galleries/headerToolbar'
import galleries from './-index/-galleries'

export default {
  components: {
    NoContent,
    HeaderToolbar,
    galleries
  },

  mixins: [saveOnInterval],

  async asyncData ({ store, params, redirect }) {
    await store.dispatch('modules/content/galleries/GetGalleries')
    let galleries = store.getters['modules/content/galleries/list']

    return {
      galleries: _.cloneDeep(galleries)
    }
  },

  data () {
    return {
      galleries: null
    }
  },

  methods: {
    sorted (newList) {
      this.galleries = newList.map((gallery, index) => ({ ...gallery, order: index }))
      this.galleryChanged()
    },

    galleryChanged () {
      this._hasUnsavedChanges = true
    },

    async saveOnInterval (skipValidation = false) {
      for (let gallery of this.galleries) {
        await this.$store.dispatch('modules/content/galleries/UpdateGallery', {
          id: gallery.id,
          order: gallery.order
        })
      }

      let galleries = this.$store.getters['modules/content/galleries/list']
      this.galleries = _.cloneDeep(galleries)
    }
  }
}
</script>

<style type="text/css" scoped>

</style>
