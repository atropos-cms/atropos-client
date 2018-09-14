<template lang="html">
  <div v-if="user">

    <el-card class="box-card">
      <div slot="header">
        <span>{{ $t('administration.user.password') }}</span>
      </div>

      <el-form
        ref="userForm"
        :model="userPassword"
        :rules="rules"
        label-position="top">

        <el-row
          :gutter="20"
          type="flex"
          class="--flex-wrap">
          <el-col :md="11">

            <el-form-item
              :label="$t('administration.user.password')"
              prop="password">
              <password-strength-input
                v-model="userPassword.password"
                :user-inputs="user"
                @strength="passwordStrength = $event"/>
            </el-form-item>

            <el-form-item
              :label="$t('administration.user.password_confirmation')"
              prop="password_confirmation">
              <el-input
                v-model="userPassword.password_confirmation"
                type="password"
                auto-complete="off"/>
            </el-form-item>

            <el-checkbox
              :value="!userPassword.dont_send_notification"
              @input="userPassword.dont_send_notification = !$event">
              {{ $t('administration.user.send_notification') }}
            </el-checkbox>

          </el-col>
          <el-col
            :md="2"
            class="administration-users--security-vertical-border">
            <span/>
          </el-col>
          <el-col
            :md="11"
            class="administration-users--security-send-reset-link">

            <el-button
              :loading="sendingResetLink"
              plain
              type="primary"
              @click="sendResetLink">
              {{ $t('auth.send-reset-link') }}
            </el-button>

          </el-col>
        </el-row>

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
import _ from 'lodash'
import saveInTransaction from '~/mixins/saveInTransaction'
import passwordStrengthInput from '~/components/passwordStrengthInput'

export default {
  components: {
    passwordStrengthInput
  },

  mixins: [saveInTransaction],

  props: {
    userId: {
      type: String,
      required: true
    }
  },

  data () {
    const validateMatch = (rule, value, callback) => {
      if (value !== this.userPassword.password) {
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
      user: null,
      sendingResetLink: false,
      passwordStrength: null,
      userPassword: {
        password: '',
        password_confirmation: '',
        dont_send_notification: false
      },
      rules: {
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

  async mounted () {
    await this.setUser()
  },

  methods: {
    async setUser () {
      this.user = _.cloneDeep(await this.$store.getters['administration/users/get'](this.userId))
    },
    async sendResetLink () {
      this.sendingResetLink = true

      await Promise.all([
        this.$store.dispatch('profile/SendPasswordReset', { uid: this.user.email }),
        this.$timeout(800)
      ])

      this.$message({
        message: this.$t('message.password-reset-sent-title', { email: this.user.email }),
        type: 'success',
        duration: 3 * 1000
      })

      this.sendingResetLink = false
    },
    async save () {
      await this.$refs['userForm'].validate()
      await this.saveInTransaction(
        () => this.$store.dispatch('administration/users/UpdateUser', {
          id: this.user.id,
          ...this.userPassword
        })
      )
      this.resetForm()
    },

    resetForm () {
      this.userPassword = {
        password: '',
        password_confirmation: '',
        dont_send_notification: false
      }
      this.$refs['userForm'].resetFields()
    }
  }
}
</script>
