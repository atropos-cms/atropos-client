<template lang="html">
  <el-col
    v-if="image"
    :xs="12"
    :sm="8"
    :md="8"
    :lg="6"
    :xl="6"
    :class="{
      '--selected': isSelected,
      '--cover': isCover
    }"
    class="modules-content-gallery--grid-item">

    <el-card
      :body-style="{ padding: '0px' }"
      class="box-card">

      <img
        :src="imageSrc"
        draggable="false"
        class="modules-content-gallery--grid-item-image">

      <div class="selection-highlight">
        <i class="material-icons">check_circle</i>
      </div>
      <div class="cover-highlight"/>

      <div class="hover-highlight">

        <help-tooltip :content="$t('modules.content.galleries.select')">
          <div
            class="selection-marker"
            @click="select">
            <i class="material-icons">check_circle</i>
          </div>
        </help-tooltip>

        <help-tooltip :content="isCover ? $t('modules.content.galleries.is-cover') : $t('modules.content.galleries.set-as-cover')">
          <div
            class="set-cover-action"
            @click="setCover">
            <i class="material-icons">panorama</i>
          </div>
        </help-tooltip>

      </div>

    </el-card>

  </el-col>
</template>

<script type="text/babel">
import itemMixin from './itemMixin'

export default {
  mixins: [itemMixin]
}
</script>
