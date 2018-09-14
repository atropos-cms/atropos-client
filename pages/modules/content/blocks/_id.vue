<template lang="html">
  <el-row
    :gutter="20"
    type="flex"
    class="--flex-wrap --flex-row">

    <el-col
      :md="14"
      :lg="18"
      class="--box-has-margin-bottom">
      <el-card class="box-card modules-content-blocks--flex-content-box">

        <el-form
          ref="form"
          :model="block"
          :rules="rules">

          <el-form-item prop="title">
            <el-input
              v-model="block.title"
              @input="blockChanged"/>
          </el-form-item>

          <el-form-item class="modules-content-blocks--flex-editor-box">
            <editor
              :value="block.content"
              has-min-height
              @input="blockContentChanged"/>
          </el-form-item>

        </el-form>

      </el-card>
    </el-col>

    <el-col
      :md="10"
      :lg="6"
      class="--box-has-margin-bottom">
      <el-card class="box-card">

        <el-collapse
          v-model="activeName"
          accordion>
          <el-collapse-item
            :title="$t('general.info')"
            name="1">

            <info
              :block.sync="block"
              @block-changed="blockChanged"/>

          </el-collapse-item>
          <el-collapse-item
            v-if="$setting('developer_mode')"
            :title="$t('general.developer-tools')"
            name="developer">

            <developer
              :block.sync="block"
              @block-changed="blockChanged"/>

          </el-collapse-item>
          <el-collapse-item
            :title="$t('general.danger-zone')"
            name="2">

            <danger :block.sync="block"/>

          </el-collapse-item>
        </el-collapse>

      </el-card>
    </el-col>

  </el-row>
</template>

<script type="text/babel">
import _ from 'lodash'
import editor from '~/components/editor'
import userSelect from '~/components/userSelect'
import saveOnInterval from '~/mixins/saveOnInterval'
import Info from './-id-info'
import Danger from './-id-danger'
import Developer from './-id-developer'

export default {
  components: {
    Info,
    Danger,
    Developer,
    editor,
    userSelect
  },

  mixins: [saveOnInterval],

  async asyncData ({ store, params, redirect }) {
    let block = await store.dispatch('modules/content/blocks/GetBlock', params.id).catch(e => {})

    if (!block) redirect({ name: 'modules-content-blocks' })

    return {
      block: _.cloneDeep(block)
    }
  },

  data () {
    return {
      block: null,
      activeName: '1',
      isRestoring: false,
      rules: {
        title: [
          { required: true, message: this.$t('validation.title.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    blockChanged () {
      this._hasUnsavedChanges = true
    },
    blockContentChanged ({ html }) {
      this.block.content = html
      this.blockChanged()
    },
    async saveOnInterval (skipValidation = false) {
      if (!skipValidation) {
        await this.$refs.form.validate()
      }
      await this.$store.dispatch('modules/content/blocks/UpdateBlock', this.block)
    }
  }
}
</script>
