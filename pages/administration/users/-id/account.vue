<template lang="html">
  <div v-if="user">

    <el-card class="box-card">
      <div slot="header">
        <span>{{ $t('administration.user.activation') }}</span>
      </div>

      <el-form
        ref="userForm"
        :model="user"
        :rules="rules"
        label-position="top">

        <el-form-item
          prop="activated"
          style="margin: 0;">

          <el-switch
            v-model="user.activated"
            :inactive-text="$t('administration.user.deactivate')"
            :active-text="$t('administration.user.activate')"/>

        </el-form-item>

      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header">
        <span>{{ $t('administration.user.account') }}</span>
      </div>

      <el-form
        :model="user"
        :rules="rules"
        label-position="top">

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              :label="$t('administration.user.first_name')"
              prop="first_name">
              <el-input v-model="user.first_name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('administration.user.last_name')"
              prop="last_name">
              <el-input v-model="user.last_name"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          :label="$t('administration.user.email')"
          prop="email">
          <el-input v-model="user.email">
            <template slot="suffix">

              <el-tooltip
                v-if="user.account_status == 'pending'"
                :content="$t('administration.user.email-not-verified')"
                class="el-input__icon"
                effect="dark"
                placement="top-end">
                <i class="material-icons text-danger">clear</i>
              </el-tooltip>

              <el-tooltip
                v-else
                :content="$t('administration.user.email-verified')"
                class="el-input__icon"
                effect="dark"
                placement="top-end">
                <i class="material-icons text-success">check</i>
              </el-tooltip>

            </template>
          </el-input>
        </el-form-item>

        <el-form-item
          :label="$t('administration.user.street')"
          prop="street">
          <el-input v-model="user.street"/>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item
              :label="$t('administration.user.postal_code')"
              prop="postal_code">
              <el-input v-model="user.postal_code"/>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item
              :label="$t('administration.user.city')"
              prop="city">
              <el-input v-model="user.city"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          :label="$t('administration.user.country')"
          prop="country">
          <el-input v-model="user.country"/>
        </el-form-item>

      </el-form>
    </el-card>

    <div class="button-container">

      <el-button @click="cancel">
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

export default {
  mixins: [saveInTransaction],

  props: {
    userId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      user: null,
      rules: {
        first_name: [
          { required: true, message: this.$t('validation.first_name.required'), trigger: 'change' }
        ],
        last_name: [
          { required: true, message: this.$t('validation.last_name.required'), trigger: 'change' }
        ],
        email: [
          { required: true, message: this.$t('validation.email.required'), trigger: 'change' },
          { type: 'email', message: this.$t('validation.email.type'), trigger: ['blur', 'change'] }
        ]
      }
    }
  },

  async mounted () {
    await this.setUser()
  },

  methods: {
    async setUser () {
      this.user = _.cloneDeep(await this.$store.getters['administration/users/get'](this.userId))
    },

    async save () {
      await this.saveInTransaction(
        () => this.$store.dispatch('administration/users/UpdateUser', this.user)
      )
      await this.setUser()
    },

    async cancel () {
      await this.setUser()
    }
  }
}
</script>
