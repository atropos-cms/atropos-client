<template lang="html">
  <div>
    <el-collapse
      v-model="activeName"
      accordion>
      <el-collapse-item
        :title="$t('general.info')"
        name="1">

        <info
          :gallery.sync="gallery"
          @gallery-changed="galleryChanged"/>

      </el-collapse-item>
      <el-collapse-item
        :title="$t('general.danger-zone')"
        name="2">

      <!-- <danger :gallery.sync="gallery"/> -->

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script type="text/babel">
import Info from './-id-info'
import Danger from './-id-danger'

export default {
  components: {
    Info,
    Danger
  },

  props: {
    gallery: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      activeName: '1'
    }
  },

  methods: {
    galleryChanged () {
      this.$emit('update:gallery', this.gallery)
      this.$emit('gallery-changed')
    }
  }
}
</script>
