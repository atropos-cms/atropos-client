<template lang="html">
  <div v-if="objectId && visible">

    <!-- Move Object Dialog -->
    <el-dialog
      :title="$t('modules.files.files.rename')"
      :visible="visible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      @open="open"
      @close="close">

      <!-- Content -->
      <el-form
        ref="renameForm"
        :model="objectCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="ok">

        <el-form-item
          :label="$t('message.modules-files-objects-rename-object')"
          prop="name">
          <el-input
            ref="input"
            v-model="objectCopy.name"/>
        </el-form-item>

      </el-form>

      <!-- Footer -->
      <span
        slot="footer"
        class="dialog-footer">

        <el-button
          @click="cancel">
          {{ $t('general.cancel') }}
        </el-button>

        <el-button
          :loading="loading"
          type="primary"
          @click="ok">
          {{ $t('general.ok') }}
        </el-button>

      </span>
    </el-dialog>
  </div>
</template>

<script type="text/babel">
import dialogMixin from './dialogMixin'

export default {
  mixins: [dialogMixin],

  data () {
    return {
      rules: {
        name: [
          { required: true, message: this.$t('validation.modules-files-files--object-name.required'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    opened () {
      this.$nextTick(() => this.$refs.input.select())
    },

    async action () {
      await this.$refs.renameForm.validate()

      this.loading = true
      await this.$store.dispatch('modules/files/UpdateObject', this.objectCopy)
      this.loading = false
    }
  }
}
</script>
