<template lang="html">

  <el-card class="box-card modules-content-blocks--list-item">
    <el-row
      :gutter="20"
      align="middle"
      type="flex">

      <el-col
        :xs="3"
        :sm="3"
        :md="2"
        :lg="1">
        <publish-status-icon :published="block.published"/>
      </el-col>

      <el-col
        :xs="11"
        :sm="11"
        :md="8"
        :lg="9">
        <span>
          {{ block.title }}
        </span>
      </el-col>

      <el-col
        :xs="8"
        :sm="8"
        :md="6"
        :lg="6">
        <span class="text-secondary">
          <user :id="block.author_id"/>
        </span>
      </el-col>

      <el-col
        :span="6"
        class="hidden-sm-and-down">
        <span class="text-secondary">{{ block.updated_at | moment("from") }}</span>
      </el-col>

      <el-col
        :xs="3"
        :sm="3"
        :md="2"
        :lg="2"
        class="modules-content-blocks--list-item-action-col">
        <nuxt-link :to="{ name: 'modules-content-blocks-id', params: { id: block.id }}">
          <el-button size="small">
            <i class="material-icons">edit</i>
          </el-button>
        </nuxt-link>
      </el-col>

    </el-row>
  </el-card>
</template>

<script type="text/babel">
import User from '~/components/user'
import PublishStatusIcon from '~/components/publishStatusIcon'

export default {
  components: {
    User,
    PublishStatusIcon
  },

  props: {
    block: {
      type: Object,
      required: true
    }
  }
}
</script>
