<template lang="html">
  <el-row
    :gutter="20"
    :class="{'--selected': isSelected}"
    class="modules-files-objects--list-item"
    align="middle"
    type="flex"
    @touchend.native.prevent="touchend"
    @click.native="select"
    @dblclick.native="open"
    @contextmenu.native="contextMenu">

    <el-col
      :span="24"
      :md="24"
      :lg="19"
      :xl="16"
      class="--flex-align-center">
      <icon :file="file"/>

      <span class="--flex-align-start">
        <span>{{ file.name | truncate(50) }}</span>
        <span class="text-secondary hidden-xs-only">{{ file.file_extension }}</span>
      </span>

      <span
        v-if="file.stared"
        class="text-secondary --is-stared">
        <i class="material-icons">star</i>
      </span>
    </el-col>

    <el-col
      :xl="5"
      class="hidden-lg-and-down">
      <span class="text-secondary">
        {{ file.modified_at || file.uploaded_at | moment("from") }}
      </span>
    </el-col>

    <el-col
      :span="6"
      :lg="4"
      class="hidden-md-and-down">
      <template v-if="file.size">
        <span class="text-secondary">
          {{ file.size || 0 | filesize }}
        </span>
      </template>
      <template v-else>
        <span class="text-secondary">-</span>
      </template>
    </el-col>

  </el-row>
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
