<template lang="html">
  <div>
    <el-form
      label-position="top"
      label-width="100px">

      <el-form-item :label="$t('general.id')">

        <copy-input :value="blockCopy.id"/>

      </el-form-item>

    </el-form>
  </div>
</template>

<script type="text/babel">
import copyInput from '~/components/copyInput'

export default {
  components: {
    copyInput
  },

  props: {
    block: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      blockCopy: this.block
    }
  },

  computed: {
    created_at: {
      get () {
        return this.blockCopy.created_at ? new Date(this.blockCopy.created_at) : null
      },
      set (value) {
        this.blockCopy.created_at = value
      }
    }
  },

  methods: {
    blockChanged () {
      this.$emit('update:block', this.blockCopy)
      this.$emit('block-changed')
    }
  }
}
</script>
