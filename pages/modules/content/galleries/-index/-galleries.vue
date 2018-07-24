<template lang="html">
  <div class="--flex-grow">
    <transition-group
      name="modules-content-gallery-image --flex-grow"
      tag="div"
      class="modules-content-gallery--grid el-row el-row--flex"
      style="margin-left: -10px; margin-right: -10px;">

      <gallery-item
        v-for="(gallery, index) in value"
        :index="gallery.order || index"
        :key="gallery.id"
        :id="gallery.id"/>
    </transition-group>
  </div>
</template>

<script type="text/babel">
import { ContainerMixin } from 'vue-slicksort'
import galleryItem from './-galleryItem'

export default {
  components: {
    galleryItem
  },

  mixins: [ContainerMixin]
}
</script>

<style type="text/css" scoped>

</style>
