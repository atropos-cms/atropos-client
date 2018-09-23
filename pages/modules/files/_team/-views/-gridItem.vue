<template lang="html">
  <el-col
    :span="12"
    :md="12"
    :lg="8"
    :xl="6"
    :class="{'--selected': isSelected}"
    class="modules-files-objects--grid-item"
    @click.native="selectOrOpen"
    @contextmenu.native.prevent="contextMenu">

    <el-card class="box-card">

      <div clasS="--file-name">
        <icon :file="file"/>
        <span>{{ file.name | truncate(25) }}</span>
      </div>
      <span
        v-if="file.stared"
        class="text-secondary --is-stared">
        <i class="material-icons">star</i>
      </span>
    </el-card>

  </el-col>
</template>

<script type="text/babel">
import User from '~/components/user'
import itemMixin from './itemMixin'

export default {
  components: {
    User
  },

  mixins: [itemMixin]
}
</script>
