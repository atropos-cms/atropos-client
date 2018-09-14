<template lang="html">
  <div>

    <header-toolbar
      :selected="selected"
      @add="add"
      @clearSelection="clearSelection"
      @deleteSelection="deleteSelection"/>

    <el-row
      v-if="gallery"
      :gutter="20"
      type="flex"
      class="modules-content-gallery--show-wrapper --flex-wrap">
      <el-col
        :md="14"
        :lg="16"
        :xl="18">

        <component
          :is="'view-grid'"
          v-model="gallery.images"
          :distance="10"
          :selected="selected"
          :cover="gallery.cover && gallery.cover.primary"
          axis="xy"
          @add="add"
          @input="sorted"
          @select="selectItem"
          @deselect="deselectItem"
          @cover="setCover"/>

      </el-col>

      <el-col
        :md="10"
        :lg="8"
        :xl="6">

        <el-card class="box-card modules-content-gallery--options">

          <gallery-options
            :gallery.sync="gallery"
            @gallery-changed="galleryChanged"/>

        </el-card>

      </el-col>

    </el-row>
  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import saveOnInterval from '~/mixins/saveOnInterval'
import HeaderToolbar from '~/components/modules/content/galleries/headerToolbarGallery'
import uploadFileButton from '~/components/modules/media/uploadFileButton'
import ViewGrid from './-views/-grid'
import galleryOptions from './-galleryOptions/-index'
import imageOptions from './-imageOptions/-index'

export default {
  components: {
    HeaderToolbar,
    galleryOptions,
    imageOptions,
    uploadFileButton,
    ViewGrid
  },

  mixins: [saveOnInterval],

  async asyncData ({ store, params, redirect }) {
    let gallery = await store.dispatch('modules/content/galleries/GetGallery', params.id).catch(e => {})

    if (!gallery) redirect({ name: 'modules-content-galleries' })

    return {
      gallery: _.cloneDeep(gallery)
    }
  },

  data () {
    return {
      gallery: null,
      selected: []
    }
  },

  computed: {
    selectedArray () {
      return Array.from(this.selected)
    }
  },

  methods: {
    async add () {
      let files = await this.$mediaBrowser({
        multiple: true,
        disabled: this.gallery.images
      })

      // map images to an object with id,
      // filter all images that are already in the gallery
      let filesToAdd = files.map((image, index) => ({ id: image.id, order: index }))
        .filter(f => !this.gallery.images.find(i => i.id === f.id))

      // add all images to the gallery
      this.gallery.images = this.gallery.images.concat(filesToAdd)

      await this.saveNow()
    },

    sorted (newList) {
      this.gallery.images = newList.map((image, index) => ({ ...image, order: index }))
      this.galleryChanged()
    },

    galleryChanged () {
      this._hasUnsavedChanges = true
    },

    async saveOnInterval (skipValidation = false) {
      let gallery = await this.$store.dispatch('modules/content/galleries/UpdateGallery', this.gallery)
      this.gallery = _.cloneDeep(gallery)
    },

    selectItem (id) {
      let selectionSet = new Set(this.selected)
      selectionSet.add(id)

      this.selected = Array.from(selectionSet)
    },

    setCover (id) {
      this.gallery.cover.primary = id
      this.galleryChanged()
    },

    deselectItem (id) {
      let selectionSet = new Set(this.selected)
      selectionSet.delete(id)

      this.selected = Array.from(selectionSet)
    },

    clearSelection () {
      this.selected = []
    },

    async deleteSelection () {
      await this.$confirm(this.$tc('message.modules-content-gallery-delete-images', this.selected.length, { number: this.selected.length }), this.$t('general.warning'), {
        confirmButtonText: this.$t('general.yes'),
        cancelButtonText: this.$t('general.no'),
        type: 'warning'
      })

      this.gallery.images = this.gallery.images.filter(i => !this.selected.includes(i.id))

      this.clearSelection()
      this._saveNow()
    }
  }
}
</script>
