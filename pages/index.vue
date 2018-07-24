<template lang="html">
  <div class="dashboard">

    <el-row
      v-if="!emailVerified && $can('profile')"
      :gutter="20"
      style="margin-bottom: 1em;">

      <el-col :span="24">
        <el-alert
          :title="$t('message.auth-email-is-not-verified-title')"
          type="primary"
          show-icon>
          <p class="el-alert__description">
            {{ $t('message.auth-email-is-not-verified-message') }}
          </p>
          <span
            class="el-alert__description --text-underlined --has-pointer-cursor"
            @click="sendEmailVerification">
            {{ $t('message.auth-email-is-not-verified-link') }}
          </span>
        </el-alert>

      </el-col>

    </el-row>

    <el-row :gutter="20">

      <el-col :lg="10">
        <profile />

        <carousel v-if="showCarousel"/>

      </el-col>

      <el-col :lg="14">
        <events v-if="$can('events')"/>
      </el-col>
    </el-row>

  </div>
</template>

<script type="text/babel">
import Carousel from './-dashboard/-carousel'
import Profile from './-dashboard/-profile'
import Events from './-dashboard/-events'

export default {
  meta: {
    permission: 'login'
  },

  components: {
    Carousel,
    Profile,
    Events
  },

  data () {
    return {
      showCarousel: true,
      email_verification_sent: false
    }
  },
  computed: {
    profile () {
      return this.$store.getters['profile/profile']
    },
    emailVerified () {
      return this.profile.account_status !== 'pending' || this.email_verification_sent
    }
  },

  methods: {
    async sendEmailVerification () {
      this.email_verification_sent = true
      await this.$store.dispatch('profile/SendEmailVerification')
    }
  }
}
</script>

<style type="text/css" scoped>
</style>
