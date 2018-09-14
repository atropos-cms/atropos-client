<template>
  <div class="login-container">
    <logo large/>

    <div class="card-box login-form-notification">
      <el-alert
        v-if="showSuccessMessage"
        :title="$t('message.password-reset-sent-title', {email: resetForm.email})"
        :description="$t('message.password-reset-sent-message')"
        type="info"
        show-icon
        @close="redirectToLogin"/>
    </div>

    <el-card
      v-if="apiConnected && !showSuccessMessage"
      class="box-card">

      <div
        slot="header"
        class="clearfix">
        <h4 class="login-title">{{ $t('auth.forgot-password') }}</h4>
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
          <el-form-item prop="uid">
            <el-input
              ref="uid"
              v-model="resetForm.uid"
              :placeholder="$t('auth.email')"
              name="uid"
              type="text"
              auto-complete="on"/>
          </el-form-item>
        </div>

        <el-button
          :loading="loading"
          type="primary"
          class="reset-submit-button"
          native-type="submit"
          @click.native.prevent="validateInput">
          {{ $t('auth.send-reset-link') }}
        </el-button>

        <el-row :gutter="20">
          <el-col
            :span="24"
            align="center">

            <nuxt-link
              :to="{ name: 'auth-login' }"
              class="login--password-reset-link">
              {{ $t('auth.remembered-password') }}
            </nuxt-link>

          </el-col>
        </el-row>

      </el-form>

    </el-card>
  </div>
</template>

<script type="text/babel">
import logo from '~/components/logo'
import displaysApiStatus from '~/mixins/displaysApiStatis.js'

export default {
  meta: {
    header: {
      title: 'auth.reset'
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
      resetForm: {
        uid: ''
      },
      resetRules: {
        uid: [{ required: true, message: this.$t('validation.reset-email.required'), trigger: 'blur' }]
      },
      loading: false,
      showSuccessMessage: false
    }
  },

  mounted () {
    this.$refs.uid && this.$refs.uid.focus()
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
      try {
        await this.$store.dispatch('profile/SendPasswordReset', this.resetForm)
        this.showSuccessMessage = true
      } catch ({ response }) {

      } finally {
        this.loading = false
      }
    },
    redirectToLogin () {
      this.$router.replace({ name: 'auth-login' })
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
