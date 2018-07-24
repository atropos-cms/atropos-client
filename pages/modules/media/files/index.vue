<template lang="html">
  <div class="modules-media-files--list">

    <header-toolbar
      :selected="selected"
      @add="add"
      @clearSelection="clearSelection"
      @deleteSelection="deleteSelection"/>

    <template v-for="(files, date, index) in fileGroup">
      <div :key="index">
        <span class="text-secondary">{{ date }}</span>
        <el-row
          :gutter="20"
          type="flex">

          <el-col
            v-for="file in files"
            :key="file.id"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="6"
            :xl="4">

            <nuxt-link :to="{name: 'modules-media-files-id', params:{id: file.id} }">
              <browser-file
                :file="file"
                :disabled-files="disabledFiles"
                :selected-files="selected"/>
            </nuxt-link>

          </el-col>
        </el-row>
      </div>
    </template>

  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import moment from 'moment'
import HeaderToolbar from '~/components/modules/media/headerToolbar'
import browserFile from '~/components/modules/media/browser-file'

export default {
  components: {
    browserFile,
    HeaderToolbar
  },

  data () {
    return {
      options: {},
      disabledFiles: [],
      selected: []
    }
  },

  computed: {
    files () {
      return this.$store.getters['modules/media/browser/files']
    },
    fileGroup () {
      // Order files by date
      let ordered = _.orderBy(this.files, file => {
        if (file.exif && file.exif.CreateDate) {
          return file.exif.CreateDate
        }
        return file.created_at
      }, ['desc'])

      // build groups for the same date
      return _.groupBy(ordered, file => {
        if (file.exif && file.exif.CreateDate) {
          return moment(file.exif.CreateDate).format('LL')
        }

        return moment(file.created_at).format('LL')
      })
    }
  },

  methods: {
    async add () {
      await this.$mediaBrowser({
        multiple: true
      })
    },

    clearSelection () {
      this.selected = []
    },

    async deleteSelection () {
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
