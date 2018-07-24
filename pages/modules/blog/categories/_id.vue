<template lang="html">
  <div>
    <el-row
      :gutter="20"
      type="flex"
      class="--flex-wrap">

      <el-col
        :md="14"
        :lg="18"
        class="--box-has-margin-bottom">
        <el-card class="box-card">

          <el-form
            ref="form"
            :model="category"
            :rules="rules">

            <el-form-item prop="title">
              <el-input
                v-model="category.title"
                @input="categoryChanged"
              />
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

              <info :category.sync="category"/>

            </el-collapse-item>
            <el-collapse-item
              :title="$t('general.danger-zone')"
              name="2">

              <danger :category.sync="category"/>

            </el-collapse-item>
          </el-collapse>

        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import saveOnInterval from '~/mixins/saveOnInterval'
import Info from './-id-info'
import Danger from './-id-danger'

export default {
  components: {
    Info,
    Danger
  },

  mixins: [saveOnInterval],

  async asyncData ({store, params, redirect}) {
    let category = await store.dispatch('modules/blog/categories/GetCategory', params.id).catch(e => {})

    if (!category) redirect({ name: 'modules-blog-categories' })

    return {
      category: _.cloneDeep(category)
    }
  },

  data () {
    return {
      category: null,
      activeName: '1',
      rules: {
        title: [
          { required: true, message: this.$t('validation.title.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    categoryChanged () {
      this._hasUnsavedChanges = true
    },
    async saveOnInterval (skipValidation = false) {
      if (!skipValidation) {
        await this.$refs.form.validate()
      }
      await this.$store.dispatch('modules/blog/categories/UpdateCategory', this.category)
    }
  }
}
</script>
