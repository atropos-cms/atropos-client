<template lang="html">
  <el-card class="box-card modules-mails-lists--lists-box">
    <div slot="header">
      <span>{{ $t('modules.mails.lists.list') }}</span>
    </div>

    <el-form
      :model="list"
      :rules="rules"
      label-position="top">

      <el-form-item
        :label="$t('modules.mails.lists.name')"
        prop="name">
        <el-input
          v-model="list.name"
          @input="input"/>
      </el-form-item>

    </el-form>
  </el-card>
</template>

<script type="text/babel">
export default {
  props: {
    list: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      name: this.list.name,
      rules: {
        name: [
          { required: true, message: this.$t('validation.modules-mails-lists--name.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    async input (value) {
      await this.$refs.form.validate()

      this.$emit('update:list', { ...this.list, name: value })
    }
  }
}
</script>
