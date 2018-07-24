<template lang="html">
  <div>

    <el-card class="box-card">
      <div slot="header">
        <span>{{ $t('administration.roles.role') }}</span>
      </div>

      <el-form
        :model="role"
        :rules="rules"
        label-position="top">

        <el-form-item
          :label="$t('administration.roles.name')"
          prop="name">
          <el-input v-model="role.name"/>
        </el-form-item>

      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>{{ $t('administration.roles.users') }}</span>
      </div>

      <user-select
        v-model="role.members"
        multiple
        size="large"/>

    </el-card>

    <div class="button-container">

      <el-button
        @click="cancel">
        {{ $t('general.cancel') }}
      </el-button>

      <el-button
        :loading="isSaving"
        type="primary"
        @click="save">
        {{ $t('general.save') }}
      </el-button>

    </div>
  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import saveInTransaction from '~/mixins/saveInTransaction'
import userSelect from '~/components/userSelect'

export default {
  components: {
    userSelect
  },

  mixins: [saveInTransaction],

  props: {
    storeRole: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      role: _.cloneDeep(this.storeRole),
      rules: {
        name: [
          { required: true, message: this.$t('validation.roles-name.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    async setRole () {
      this.role = _.cloneDeep(await this.$store.getters['administration/roles/get'](this.$route.params.id))
    },

    async save () {
      await this.saveInTransaction(
        () => this.$store.dispatch('administration/roles/UpdateRole', this.role)
      )
      this.setRole()
    },

    cancel () {
      this.setRole()
    }
  }
}
</script>
