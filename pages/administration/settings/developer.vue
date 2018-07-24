<template lang="html">
  <div>

    <el-card
      :body-style="{padding: 0}"
      class="box-card">

      <div class="box-card--panel">
        <span>{{ $t('administration.settings.developer-info') }}</span>

        <div
          class="input-description"
          v-html="$t('help.administration.settings.developer-info')"/>

        <el-form size="small">
          <el-form-item :label="$t('administration.settings.api-url')">
            <copy-input :value="apiUrl"/>
          </el-form-item>
          <el-form-item :label="$t('administration.settings.tenant')">
            <copy-input :value="tenantId"/>
          </el-form-item>
        </el-form>

      </div>

      <div class="box-card--panel">
        <span>{{ $t('administration.settings.developer-mode') }}</span>

        <div
          class="input-description"
          v-html="$t('help.administration.settings.developer-mode')"/>

        <el-switch
          v-model="settings.developer_mode"
          :active-text="$t('administration.settings.enable-developer-mode')"/>
      </div>

      <div class="box-card--panel">
        <span>{{ $t('administration.settings.clear-cache') }}</span>

        <div
          class="input-description"
          v-html="$t('help.administration.settings.clear-cache')"/>

        <el-button
          :loading="clearingServerCache"
          type="info"
          @click="clearServerCache">
          {{ $t('administration.settings.clear-cache-now') }}
        </el-button>
      </div>

    </el-card>

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
import { getTenant } from '~/utils/tenant'
import { ClearServerCache } from '~/api/administration/settings'
import copyInput from '~/components/copyInput'
import saveInTransaction from '~/mixins/saveInTransaction'

export default {
  meta: {
    permission: 'administration-settings'
  },

  components: {
    copyInput
  },

  mixins: [saveInTransaction],

  async asyncData ({store, params}) {
    await store.dispatch('administration/settings/GetSettings', {stats: true})
    return {settings: _.cloneDeep(store.getters['administration/settings/all'])}
  },

  data () {
    return {
      settings: {},
      clearingServerCache: false
    }
  },

  computed: {
    apiUrl () {
      return process.env.PUBLIC_URL
    },
    tenantId () {
      return getTenant()
    }
  },

  methods: {
    async setSettings () {
      this.settings = _.cloneDeep(this.$store.getters['administration/settings/all'])
    },

    async clearServerCache () {
      this.clearingServerCache = true

      await Promise.all([ClearServerCache(), this.$timeout(800)])

      this.clearingServerCache = false
    },

    async save () {
      await this.saveInTransaction(
        () => this.$store.dispatch('administration/settings/UpdateSettings', this.settings)
      )
      await this.setSettings()
    },

    async cancel () {
      await this.setSettings()
    }
  }
}
</script>
