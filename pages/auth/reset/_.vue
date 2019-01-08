<template>
  <div class="login-container">
    <logo large/>

    <el-card
      v-if="apiConnected"
      class="box-card">

      <div
        slot="header"
        class="clearfix">
        <h4 class="login-title">{{ $t('auth.reset-password') }}</h4>
      </div>

      <el-form
        ref="resetForm"
        :model="resetForm"
        :rules="resetRules"
        class="card-box login-form"
        auto-complete="on"
        label-position="left"
        @submit="validateInput">

        <!-- Reset form-->
        <div>
          <el-form-item prop="password">
            <password-strength-input
              ref="password"
              v-model="resetForm.password"
              :placeholder="$t('auth.password')"
              @strength="passwordStrength = $event"/>
          </el-form-item>

          <el-form-item prop="password_confirmation">
            <el-input
              v-model="resetForm.password_confirmation"
              :placeholder="$t('auth.password_confirmation')"
              auto-complete="off"
              name="password_confirmation"
              type="password"/>
          </el-form-item>

        </div>

        <el-button
          :loading="loading"
          type="primary"
          class="reset-submit-button"
          native-type="submit"
          @click.native.prevent="validateInput">
          {{ $t('auth.reset-password') }}
        </el-button>

      </el-form>

    </el-card>
  </div>
</template>

<script type="text/babel">
import logo from '~/components/logo'
import displaysApiStatus from '~/mixins/displaysApiStatis.js'
import passwordStrengthInput from '~/components/passwordStrengthInput'

export default {
  meta: {
    header: {
      title: 'auth.reset'
    },
    permission: null
  },

  middleware: 'guest',

  components: {
    logo,
    passwordStrengthInput
  },

  mixins: [displaysApiStatus],

  data () {
    const validateMatch = (rule, value, callback) => {
      if (value !== this.resetForm.password) {
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
      resetForm: {
        password: '',
        password_confirmation: ''
      },
      resetRules: {
        password: [
          { required: true, message: this.$t('validation.password.required'), trigger: 'change' },
          { min: 6, message: this.$t('validation.password.min'), trigger: 'change' },
          { validator: validateStrength, trigger: 'change' }
        ],
        password_confirmation: [
          { required: true, message: this.$t('validation.password_confirmation.required'), trigger: 'change' },
          { validator: validateMatch, trigger: 'change' }
        ]
      },
      loading: false
    }
  },

  mounted () {
    this.$refs.password && this.$refs.password.focus()
  },

  methods: {
    validateInput () {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          return this.handleReset()
        }
        return false
      })
    },

    async handleReset () {
      this.loading = true

      let data = {
        ...this.resetForm,
        token: this.$route.params.pathMatch
      }

      try {
        this.$apiDisableErrorReporting()
        await this.$store.dispatch('profile/ResetPassword', data)
        this.$router.replace({ path: '/' })
      } catch ({ response }) {
        this.handleError(response.data.error)
      } finally {
        this.loading = false
        this.$apiEnableErrorReporting()
      }
    },

    handleError ({ message }) {
      if (message.match(/The token is invalid or expired/g)) {
        return this.$message({
          message: this.$t('errors.reset-token-invalid'),
          type: 'error',
          duration: 3 * 1000
        })
      }
    }
  }
}
</script>

<style scoped>
  .reset-submit-button {
    width: 100%;
    margin-bottom: 30px;
    margin-top: 30px;
  }
</style>
