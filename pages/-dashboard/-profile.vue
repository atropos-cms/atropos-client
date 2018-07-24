<template lang="html">
  <el-card class="box-card">

    <div
      slot="header"
      class="clearfix">
      <h3>{{ welcomeMessage }}</h3>
    </div>

    <!-- Complete Profile -->
    <template v-if="completedPercentage < 100 && $can('profile')">
      <h5>
        <nuxt-link
          :to="{name: 'profile'}"
          class="dashboard-complete-profile">

          <i class="material-icons">person</i>
          <span>{{ $t('dashboard.profile.complete-profile.title') }}</span>
        </nuxt-link>

      </h5>
      <br>

      <el-row
        :gutter="20"
        type="flex"
        justify="center"
        align="middle"
        class="dashboard-complete-profile--wrapper">

        <el-col
          :md="8"
          class="hidden-sm-and-down --flex-justify-center">

          <el-progress
            :percentage="completedPercentage"
            :width="100"
            type="circle"/>

        </el-col>
        <el-col
          :md="16"
          class="--flex-justify-center">

          <ul
            style="margin: 0"
            class="text-secondary">

            <li v-if="!completed.account_status">{{ $t('dashboard.profile.complete-profile.verify-email') }}</li>
            <li v-if="!completed.street">{{ $t('dashboard.profile.complete-profile.street') }}</li>
            <li v-if="!completed.postal_code">{{ $t('dashboard.profile.complete-profile.postalcode') }}</li>
            <li v-if="!completed.city">{{ $t('dashboard.profile.complete-profile.city') }}</li>
            <li v-if="!completed.country">{{ $t('dashboard.profile.complete-profile.country') }}</li>

          </ul>

        </el-col>

      </el-row>
    </template>

    <div
      v-else
      class="text-secondary">

      <el-row :gutter="20">
        <el-col :span="8">
          {{ $t('dashboard.profile.info.last_login') }}:
        </el-col>
        <el-col :span="16">
          <span>
            {{ profile.last_login | moment('LLL') }}
          </span>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          {{ $t('dashboard.profile.info.email') }}:
        </el-col>
        <el-col :span="16">
          <span>
            {{ profile.email }}
          </span>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          {{ $t('dashboard.profile.info.address') }}:
        </el-col>
        <el-col :span="16">
          <div>
            {{ profile.full_name }}
          </div>
          <div>
            {{ profile.street }}
          </div>
          <div>
            {{ profile.postal_code }} {{ profile.city }}
          </div>
        </el-col>
      </el-row>

    </div>

  </el-card>
</template>

<script type="text/babel">
import moment from 'moment'

export default {
  computed: {
    profile () {
      return this.$store.getters['profile/profile']
    },
    welcomeTranslationString () {
      let hour = moment().hour()
      let translationObject = 'dashboard.welcome.general'

      if (hour > 6 && hour < 11) {
        translationObject = 'dashboard.welcome.morning'
      } else if (hour > 13 && hour < 17) {
        translationObject = 'dashboard.welcome.afternoon'
      } else if (hour > 19 && hour < 23) {
        translationObject = 'dashboard.welcome.night'
      }

      let translationObjectKeys = Object.keys(this.$t(translationObject))
      let key = Math.floor(moment().unix() / 100) % translationObjectKeys.length + 1

      return `${translationObject}.${key}`
    },
    welcomeMessage () {
      return this.$t(this.welcomeTranslationString, {
        name: this.profile.first_name,
        fist_name: this.profile.first_name,
        last_name: this.profile.last_name })
    },
    completed () {
      return {
        account_status: this.profile.account_status !== 'pending',
        street: !!this.profile.street,
        postal_code: !!this.profile.postal_code,
        city: !!this.profile.city,
        country: !!this.profile.country
      }
    },
    completedPercentage () {
      let values = Object.values(this.completed)
      return 100 / values.length * values.filter(v => v).length
    }
  }
}
</script>
