<template lang="html">
  <div class="modules-content-gallery--grid-wrapper">
    <transition-group
      name="modules-content-gallery-image"
      tag="div"
      class="modules-content-gallery--grid el-row el-row--flex"
      style="margin-left: -10px; margin-right: -10px;">

      <template v-if="hasFiles" >
        <item
          v-for="(item, index) in value"
          :index="item.order || index"
          :item="item.id"
          :key="item.id"
          :selected="selected"
          :cover="cover"
          @select="select(item.id)"
          @deselect="deselect(item.id)"
          @cover="setCover(item.id)"/>
      </template>

      <el-col
        key="add-image-col"
        :xs="12"
        :sm="8"
        :md="8"
        :lg="6"
        :xl="6"
        class="modules-content-gallery--grid-item-add"
        @click.native="add">

        <el-card
          :body-style="{ padding: '0px' }"
          class="box-card">

          <div class="image-placeholder">
            <h4>{{ $t('message.click-here-to-add-a-photo') }}</h4>
          </div>

        </el-card>

      </el-col>

    </transition-group>
  </div>
</template>

<script type="text/babel">
import Item from './-gridItem'
import viewMixin from './viewMixin'

export default {
  components: {
    Item
  },

  mixins: [viewMixin],

  mounted () {
    this.scrollContainer = document.getElementById('app-content')
  }
}
</script>

<style type="text/css" scoped>
</style>
