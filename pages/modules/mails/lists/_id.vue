<template>
  <div>

    <el-row
      v-if="list"
      :gutter="20">

      <el-col :span="24">
        <list-list
          :list.sync="list"/>

        <list-roles
          :list.sync="list"/>

        <list-users
          :list.sync="list"/>

        <div class="button-container">

          <el-button
            @click="cancel">
            {{ $t('general.cancel') }}
          </el-button>

          <el-button
            :disabled="disableSave"
            :loading="isSaving"
            type="primary"
            @click="save">
            {{ $t('general.save') }}
          </el-button>

        </div>

      </el-col>
    </el-row>

  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import saveInTransaction from '~/mixins/saveInTransaction'
import listList from './-id-list'
import listRoles from './-id-roles'
import listUsers from './-id-users'

export default {
  meta: {
    sidebar: {
      active: 'modules-mails-send'
    }
  },

  components: {
    listList,
    listRoles,
    listUsers
  },

  mixins: [
    saveInTransaction
  ],

  async asyncData ({ store, params }) {
    await store.dispatch('modules/mails/lists/GetLists')
    return { list: _.cloneDeep(store.getters['modules/mails/lists/get'](params.id)) }
  },

  data () {
    return {
      list: null,
      listEditPage: 'account'
    }
  },

  computed: {
    disableSave () {
      return !this.list.name
    }
  },

  methods: {
    async setList () {
      this.list = _.cloneDeep(_.cloneDeep(this.$store.getters['modules/mails/lists/get'](this.$route.params.id)))
    },

    async save () {
      await this.saveInTransaction(
        () => this.$store.dispatch('modules/mails/lists/UpdateList', this.list)
      )
      this.setList()
    },

    cancel () {
      this.setList()
    }
  }
}
</script>
