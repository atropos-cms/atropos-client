<template>
  <div class="login-container">
    <div>

      <div>
        <logo large/>

        <!-- This error message will be rendered on the server, to inform the user that javascript is disabled -->
        <noscript inline-template>
          <el-alert
          :title="$t('errors.javascript-disabled')"
          :closable="false"
          type="error"
          show-icon>
          </el-alert>
        </noscript>

        <!-- Login Form -->
        <el-card
          v-if="apiConnected"
          :class="{'hide-login-form-box': hideLoginForm || loggedIn}"
          class="box-card login-form-box">

          <div
            slot="header"
            class="clearfix">
            <h4 class="login-title">{{ $t('auth.login') }}</h4>
          </div>

          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="card-box login-form"
            auto-complete="on"
            label-position="left"
            @submit="validateInput">

            <!-- Login form-->
            <el-form-item prop="uid">
              <el-input
                ref="uid"
                v-model="loginForm.uid"
                :placeholder="$t('auth.email')"
                auto-complete="on"
                name="uid"
                type="text"/>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                :type="pwdType"
                :placeholder="$t('auth.password')"
                auto-complete="on"
                name="password"
                @keyup.enter.native="handleLogin"/>
            </el-form-item>

            <el-button
              :loading="loading"
              type="primary"
              class="login-submit-button"
              native-type="submit"
              @click.native.prevent="validateInput">
              {{ $t('auth.login') }}
            </el-button>

            <!-- Remember me button -->
            <el-row
              :gutter="20"
              type="flex"
              class="--flex-wrap">
              <el-col
                :md="24"
                align="right">

                <nuxt-link
                  :to="{ name: 'auth-reset' }"
                  class="login--password-reset-link">
                  {{ $t('auth.forgot-password') }}
                </nuxt-link>

              </el-col>
            </el-row>

          </el-form>
        </el-card>
      </div>

      <!-- Demo Mode Box -->
      <transition name="el-zoom-in-top">

        <el-card
          v-if="displayDemoAccounts"
          class="box-card"
          style="margin-top: 2em;">

          <div>
            <b>{{ $t('auth.demo-accounts') }}</b>
          </div>

          <el-button
            plain
            @click="demoAdmin">Admin</el-button>

          <el-button
            plain
            @click="demoUser">User</el-button>

          <el-button
            plain
            @click="demoGuest">Guest</el-button>

        </el-card>

      </transition>
    </div>
  </div>
</template>

<script type="text/babel">
import logo from '~/components/logo'
import displaysApiStatus from '~/mixins/displaysApiStatis.js'

export default {
  meta: {
    header: {
      title: 'auth.login'
    },
    permission: null
  },

  middleware: 'guest',

  components: {
    logo
  },

  mixins: [displaysApiStatus],

  data () {
    return {
      hideLoginForm: true,
      loginForm: {
        uid: '',
        password: ''
      },
      loginRules: {
        uid: [{required: true, message: this.$t('validation.login-email.required'), trigger: 'change'}],
        password: [{required: true, message: this.$t('validation.login-password.required'), trigger: 'change'}]
      },
      pwdType: 'password',
      loading: false,
      showPassword: false,
      errorMessageInstance: null,
      displayDemoAccounts: process.env.NODE_ENV === 'development'
    }
  },

  computed: {
    loggedIn () {
      return this.$store.getters['profile/loggedIn']
    }
  },

  async mounted () {
    this.$refs.uid && this.$refs.uid.focus()
    await this.$timeout(10)
    this.hideLoginForm = false
  },

  methods: {
    toggleShowPassword () {
      this.pwdType = 'password'
      this.showPassword = !this.showPassword

      if (this.showPassword) {
        this.pwdType = 'text'
      }
    },

    validateInput () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          return this.handleLogin()
        }
        return false
      })
    },

    async handleLogin () {
      this.loading = true

      if (this.errorMessageInstance) this.errorMessageInstance.close()

      try {
        this.$apiDisableErrorReporting()
        await this.$store.dispatch('profile/LoginByUid', this.loginForm)
        this.redirectAfterSucessfulLogin()
      } catch (error) {
        if (!error.response) {
          console.log(error)
          return
        }

        let response = error.response
        this.errorMessageInstance = this.handleError({
          message: (response.data.error && response.data.error.message) || response.data,
          headers: response.headers,
          status: response.status
        })
      } finally {
        this.loading = false
        this.$apiEnableErrorReporting()
      }
    },

    handleError ({message, status, headers}) {
      if (message.match(/E_ACCOUNT_NOT_ACTIVATED:.*/g)) {
        return this.$message({
          message: this.$t('errors.login-account-not-activated'),
          type: 'error',
          duration: 8 * 1000
        })
      }

      if (message.match(/E_VALIDATION_FAILED:.*/g)) {
        return this.$message({
          message: this.$t('errors.login-password-mismatch'),
          type: 'error',
          duration: 8 * 1000
        })
      }

      if (message.match(/E_PERMISSION_DENIED:.*/g)) {
        return this.$message({
          message: this.$t('errors.login-permission-denied'),
          type: 'error',
          duration: 8 * 1000
        })
      }

      if (status === 429) {
        return this.$message({
          message: this.$t('errors.too-many-requests', {retryAfter: headers['retry-after']}),
          type: 'error',
          duration: 8 * 1000
        })
      }

      if (message.match(/E_NO_TENANT_FOUND:.*/g)) {
        return this.$message({
          message: this.$t('errors.no-tenant-found'),
          type: 'error',
          duration: 8 * 1000
        })
      }

      return this.$message({
        message: message,
        type: 'error',
        duration: 8 * 1000
      })
    },

    redirectAfterSucessfulLogin () {
      let route = {name: 'index'}

      if (this.$route.query.redirect) {
        route = this.$route.query.redirect
      }

      this.$router.replace(route)
    },

    demoAdmin () {
      this.loginForm.uid = 'darth_vader@starwars.com'
      this.loginForm.password = 'darth-1234'
    },

    demoUser () {
      this.loginForm.uid = 'luke_skywalker@starwars.com'
      this.loginForm.password = 'luke-1234'
    },

    demoGuest () {
      this.loginForm.uid = 'chewbacca@starwars.com'
      this.loginForm.password = 'chewbacca-1234'
    }
  }
}
</script>
