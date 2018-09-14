<template lang="html">
  <el-card class="box-card modules-files-teams--teams-box">
    <div slot="header">
      <span>{{ $t('modules.files.teams.team') }}</span>
    </div>

    <el-form
      :model="team"
      :rules="rules"
      label-position="top">

      <el-form-item
        :label="$t('modules.files.teams.name')"
        prop="name">
        <el-input
          v-model="team.name"
          @input="inputName"/>
      </el-form-item>

      <div>
        <label class="el-form-item__label">{{ $t('modules.files.teams.storage-used') }}</label>
        <div v-if="team.storageUsed">{{ team.storageUsed | filesize }}</div>
        <div v-else>-</div>
      </div>

    </el-form>
  </el-card>
</template>

<script type="text/babel">
export default {
  props: {
    team: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      inputVisible: false,
      inputValue: '',
      rules: {
        name: [
          { required: true, message: this.$t('validation.modules-files-teams--name.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    inputName (value) {
      this.$emit('update:team', { ...this.team, name: value })
    },
    handleClose (tag) {
      let tags = this.team.tags.filter(t => t.id !== tag.id)

      this.$emit('update:team', { ...this.team, tags: tags })
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        let tags = this.team.tags
        tags.push({ name: inputValue })
        this.$emit('update:team', { ...this.team, tags: tags })
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
