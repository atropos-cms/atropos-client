<template lang="html">
  <el-row
    v-loading="isRestoring"
    :gutter="20"
    type="flex"
    class="--flex-wrap --flex-row">

    <el-col
      :md="14"
      :lg="18"
      class="--box-has-margin-bottom">
      <el-card class="box-card modules-blog-articles--flex-content-box">

        <el-form
          ref="form"
          :model="article"
          :rules="rules">

          <el-row :gutter="20">
            <el-col :span="16">

              <el-form-item
                :label="$t('modules.blog.articles.title')"
                prop="title">
                <el-input
                  v-model="article.title"
                  @input="articleChanged"/>
              </el-form-item>

            </el-col>
            <el-col :span="8">

              <el-form-item
                :label="$t('modules.blog.articles.type')"
                prop="type">

                <el-select
                  v-model="article.type"
                  @input="articleChanged">
                  <el-option
                    v-for="item in supportedTypes"
                    :key="item"
                    :label="$t(`modules.blog.articles.types.${item}`)"
                    :value="item"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item class=" modules-blog-articles--flex-editor-box">
            <editor
              :value="article.content"
              has-min-height
              @input="articleContentChanged"/>
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
            :title="$t('modules.blog.articles.cover')"
            name="cover">

            <cover
              :article.sync="article"
              @article-changed="articleChanged"/>

          </el-collapse-item>
          <el-collapse-item
            :title="$t('modules.blog.articles.attachments')"
            name="attachements">

            <attachments
              :article.sync="article"
              @article-changed="articleChanged"/>

          </el-collapse-item>
          <el-collapse-item
            :title="$t('general.info')"
            name="info">

            <info
              :article.sync="article"
              @article-changed="articleChanged"/>

          </el-collapse-item>
          <el-collapse-item
            v-if="$setting('developer_mode')"
            :title="$t('general.developer-tools')"
            name="developer">

            <developer
              :article.sync="article"
              @article-changed="articleChanged"/>

          </el-collapse-item>
          <!--<el-collapse-item
            title="Versions"
            name="2">

              <el-card
              class="box-card modules-blog-articles--version-box"
              v-for="version in versions"
              :key="version.id">

              <el-row type="flex">

                <el-col :span="18">
                  {{ version.created_at | moment("from") }}
                </el-col>

                <el-col
                  :span="6"
                  style="text-align:right">

                  <el-button
                    type="primary"
                    size="small"
                    plain
                    @click="restoreVersion(version)">
                    <i class="material-icons">restore</i>
                  </el-button>
                </el-col>

              </el-row>

            </el-card>

          </el-collapse-item> -->
          <el-collapse-item
            :title="$t('general.danger-zone')"
            name="danger">

            <danger :article.sync="article"/>

          </el-collapse-item>
        </el-collapse>

      </el-card>
    </el-col>

  </el-row>
</template>

<script type="text/babel">
import _ from 'lodash'
import Attachments from './-id-attachments'
import Cover from './-id-cover'
import Danger from './-id-danger'
import Developer from './-id-developer'
import Info from './-id-info'
import editor from '~/components/editor'
import saveOnInterval from '~/mixins/saveOnInterval'

export default {
  components: {
    Attachments,
    Cover,
    Danger,
    Developer,
    Info,
    editor
  },

  mixins: [saveOnInterval],

  async asyncData ({store, params, redirect}) {
    let article = await store.dispatch('modules/blog/articles/GetArticle', params.id).catch(e => {})

    if (!article) redirect({ name: 'modules-blog-articles' })

    // let versions = await store.dispatch('modules/blog/articles/GetArticleVersions', params.id)
    return {
      article: _.cloneDeep(article)
      // versions: versions
    }
  },

  data () {
    return {
      article: null,
      activeName: 'cover',
      isRestoring: false,
      rules: {
        title: [
          { required: true, message: this.$t('validation.title.required'), trigger: 'change' }
        ]
      },
      supportedTypes: ['text', 'image']
    }
  },

  methods: {
    articleChanged () {
      this._hasUnsavedChanges = true
    },
    articleContentChanged ({html}) {
      this.article.content = html
      this.articleChanged()
    },
    async saveOnInterval (skipValidation = false) {
      if (!skipValidation) {
        await this.$refs.form.validate()
      }
      await this.$store.dispatch('modules/blog/articles/UpdateArticle', this.article)
    }
    // async restoreVersion (version) {
    //   this.isRestoring = true
    //   await this.$store.dispatch('modules/blog/articles/RestoreArticleVersion', {
    //     articleId: this.article.id,
    //     versionId: version.id
    //   })

    //   let article = await this.$store.dispatch('modules/blog/articles/GetArticle', this.article.id)
    //   let versions = await this.$store.dispatch('modules/blog/articles/GetArticleVersions', this.article.id)

    //   this.article = _.cloneDeep(article)
    //   this.versions = versions

    //   this.isRestoring = false
    // }
  }
}
</script>
