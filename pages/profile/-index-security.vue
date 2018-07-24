<template lang="html">
  <div>
    <el-card class="box-card profile-security-tab">
      <div slot="header">
        <span>{{ $t('profile.security') }}</span>
      </div>

      <el-form
        ref="profileForm"
        :model="profile"
        :rules="rules"
        label-position="top">

        <el-form-item
          :label="$t('administration.user.old_password')"
          prop="old_password">
          <el-input
            v-model="profile.old_password"
            type="password"
            auto-complete="off"/>
        </el-form-item>

        <el-form-item
          :label="$t('administration.user.password')"
          prop="password">
          <password-strength-input
            v-model="profile.password"
            :user-inputs="storeUser"
            @strength="passwordStrength = $event"/>
        </el-form-item>

        <el-form-item
          :label="$t('administration.user.password_confirmation')"
          prop="password_confirmation">
          <el-input
            v-model="profile.password_confirmation"
            type="password"
            auto-complete="off"/>
        </el-form-item>

      </el-form>
    </el-card>

    <div class="button-container">

      <el-button @click="resetForm">
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
import saveInTransaction from '~/mixins/saveInTransaction'
import passwordStrengthInput from '~/components/passwordStrengthInput'

export default {
  components: {
    passwordStrengthInput
  },

  mixins: [saveInTransaction],

  data () {
    const validateMatch = (rule, value, callback) => {
      if (value !== this.profile.password) {
        callback(new Error(this.$t('validation.password_confirmation.match')))
      }
      callback()
    }

    const validateStrength = (rule, value, callback) => {
      if (this.passwordStrength !== null && this.passwordStrength < 1) {
        callback(new Error(this.$t('validation.password.weak')))
      }
      callback()
    }

    return {
      passwordStrength: null,
      profile: {
        old_password: '',
        password: '',
        password_confirmation: ''
      },
      rules: {
        old_password: [
          { required: true, message: this.$t('validation.old_password.required'), trigger: 'change' }
        ],
        password: [
          { required: true, message: this.$t('validation.password.required'), trigger: 'change' },
          { min: 6, message: this.$t('validation.password.min'), trigger: 'change' },
          { validator: validateStrength, trigger: 'change' }
        ],
        password_confirmation: [
          { required: true, message: this.$t('validation.password_confirmation.required'), trigger: 'change' },
          { validator: validateMatch, trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    storeUser () {
      return this.$store.getters['profile/profile']
    }
  },

  methods: {
    async save () {
      await this.$refs['profileForm'].validate()
      await this.saveInTransaction(
        () => this.$store.dispatch('profile/UpdateProfile', this.profile)
      )
      this.resetForm()
    },
    resetForm () {
      this.profile = {
        old_password: '',
        password: '',
        password_confirmation: ''
      }
      this.$refs['profileForm'].resetFields()
    }
  }
}
</script>
