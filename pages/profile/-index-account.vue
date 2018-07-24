<template lang="html">
  <el-card class="box-card">
    <div slot="header">
      <span>{{ $t('profile.account') }}</span>
    </div>

    <el-form
      ref="form"
      :model="profile"
      :rules="rules"
      label-position="top">

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :label="$t('administration.user.first_name')"
            prop="first_name">
            <el-input
              v-model="profile.first_name"
              @input="profileChanged"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('administration.user.last_name')"
            prop="last_name">
            <el-input
              v-model="profile.last_name"
              @input="profileChanged"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        :label="$t('administration.user.email')"
        prop="email">
        <el-input
          v-model="profile.email"
          @input="profileChanged">

          <template slot="suffix">
            <el-tooltip
              v-if="profile.account_status == 'pending'"
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
        <el-input
          v-model="profile.street"
          @input="profileChanged"/>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item
            :label="$t('administration.user.postal_code')"
            prop="postal_code">
            <el-input
              v-model="profile.postal_code"
              @input="profileChanged"/>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item
            :label="$t('administration.user.city')"
            prop="city">
            <el-input
              v-model="profile.city"
              @input="profileChanged"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        :label="$t('administration.user.country')"
        prop="country">
        <el-input
          v-model="profile.country"
          @input="profileChanged"/>
      </el-form-item>

    </el-form>
  </el-card>
</template>

<script type="text/babel">
import saveOnInterval from '~/mixins/saveOnInterval'
import _ from 'lodash'

export default {
  mixins: [saveOnInterval],

  data () {
    return {
      profile: null,
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

  created () {
    this.setProfile()
  },

  methods: {
    setProfile () {
      this.profile = _.cloneDeep(this.$store.getters['profile/profile'])
    },
    profileChanged () {
      this._hasUnsavedChanges = true
    },
    async saveOnInterval (skipValidation = false) {
      if (!skipValidation) {
        await this.$refs.form.validate()
      }

      await this.$store.dispatch('profile/UpdateProfile', this.profile)
      this.setProfile()
    }
  }

}
</script>
