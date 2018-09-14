<template lang="html">
  <div>

    <!-- Locale -->
    <el-card
      :body-style="{padding: 0}"
      class="box-card">

      <div slot="header">
        <span>{{ $t('administration.settings.locale') }}</span>
      </div>

      <div class="box-card--panel">
        <div
          class="input-description"
          v-html="$t('help.administration.settings.locale')"/>

        <el-select v-model="settings.locale">
          <el-option
            v-for="locale in supportedLocales"
            :key="locale.key"
            :label="$t(`administration.settings.locales.${locale.key}`)"
            :value="locale.key"/>
        </el-select>
      </div>

    </el-card>

    <!-- Branding -->
    <el-card
      :body-style="{padding: 0}"
      class="box-card">

      <div slot="header">
        <span>{{ $t('administration.settings.branding') }}</span>
      </div>

      <div class="box-card--panel">
        <div
          class="input-description"
          v-html="$t('help.administration.settings.branding')"/>

        <div class="administration-settings-branding">
          <div class="administration-settings-branding--color-abbreviation-group">

            <el-color-picker
              v-model="settings.branding_color"
              :predefine="predefinedBrandingColors"
              class="administration-settings-branding_color"/>

            <el-input
              v-model="settings.branding_abbreviation"
              :placeholder="$t('administration.settings.branding_abbreviation')"
              :maxlength="3"
              class="administration-settings-branding_abbreviation"/>
          </div>

          <el-input
            v-model="settings.branding_name"
            :placeholder="$t('administration.settings.branding_name')"
            class="administration-settings-branding_name"/>
        </div>

      </div>

    </el-card>

    <!-- Contact -->
    <el-card
      :body-style="{padding: 0}"
      class="box-card">

      <div slot="header">
        <span>{{ $t('administration.settings.contacts') }}</span>
      </div>
      <el-form
        :model="settings"
        :rules="rules">

        <div class="box-card--panel">
          <span>{{ $t('administration.settings.admin-contact') }}</span>

          <div
            class="input-description"
            v-html="$t('help.administration.settings.admin-contact')"/>

          <el-form-item
            prop="admin_contact"
            style="margin: 0;">
            <el-input v-model="settings.admin_contact"/>
          </el-form-item>

        </div>
        <div class="box-card--panel">
          <span>{{ $t('administration.settings.user-contact') }}</span>

          <div
            class="input-description"
            v-html="$t('help.administration.settings.user-contact')"/>

          <el-form-item
            prop="user_contact"
            style="margin: 0;">
            <user-select
              v-model="settings.user_contact_id"/>
          </el-form-item>

          <div
            class="input-description"
            v-html="$t('help.administration.settings.user-contact-public-access')"/>

          <el-switch
            v-model="settings.user_contact_public_access"
            :active-text="$t('administration.settings.user-contact-public-access')"/>
        </div>

      </el-form>
    </el-card>

    <!-- Save Buttons -->
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
import userSelect from '~/components/userSelect'
import { updateApplicationLocale } from '~/utils/application'
import saveInTransaction from '~/mixins/saveInTransaction'

export default {
  meta: {
    permission: 'administration-settings'
  },

  components: {
    userSelect
  },

  mixins: [saveInTransaction],

  async asyncData ({ store, params }) {
    await store.dispatch('administration/settings/GetSettings', { stats: true })
    return { settings: _.cloneDeep(store.getters['administration/settings/all']) }
  },

  data () {
    return {
      rules: {
        admin_contact: [
          { type: 'email', message: this.$t('validation.email.type'), trigger: ['blur', 'change'] }
        ],
        user_contact: [
          { type: 'email', message: this.$t('validation.email.type'), trigger: ['blur', 'change'] }
        ]
      },
      settings: {},
      supportedLocales: [
        { key: 'de' },
        { key: 'en' }
      ],
      predefinedBrandingColors: [
        '#ee2626',
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#00ced1',
        '#1e90ff',
        '#dd1693'
      ]
    }
  },

  methods: {
    async setSettings () {
      this.settings = _.cloneDeep(this.$store.getters['administration/settings/all'])
    },

    async save () {
      const prevLocale = (this.$store.getters['administration/settings/all']).locale

      await this.saveInTransaction(
        () => this.$store.dispatch('administration/settings/UpdateSettings', this.settings)
      )
      await this.setSettings()

      if (prevLocale === this.settings.locale) return

      const loading = this.$loading({ lock: true })
      loading.$el.style.zIndex = loading.$el.style.zIndex - 3

      // live update application language if changed
      await this.$timeout(800)
      updateApplicationLocale(this.settings.locale)
      await this.$timeout(800)

      loading.close()
    },

    async cancel () {
      await this.setSettings()
    }
  }
}
</script>
