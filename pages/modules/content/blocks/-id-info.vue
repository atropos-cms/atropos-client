<template lang="html">
  <div>
    <el-form
      label-position="left"
      label-width="100px">

      <el-form-item :label="$t('modules.content.blocks.published')">
        <el-switch
          v-model="block.published"
          @input="blockChanged"/>
      </el-form-item>

      <el-form-item :label="$t('modules.content.blocks.author')">
        <user-select
          v-model="block.author_id"
          @input="blockChanged"/>
      </el-form-item>

    </el-form>
  </div>
</template>

<script type="text/babel">
import userSelect from '~/components/userSelect'
import categoriesSelect from '~/components/modules/blog/categories/categoriesSelect'

export default {
  components: {
    userSelect,
    categoriesSelect
  },

  props: {
    block: {
      type: Object,
      required: true
    }
  },

  methods: {
    blockChanged () {
      this.$emit('update:block', this.block)
      this.$emit('block-changed')
    }
  }
}
</script>
