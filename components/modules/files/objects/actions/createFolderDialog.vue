<template lang="html">
  <div v-if="objectCopy && visible">

    <!-- Create Folder Dialog -->
    <el-dialog
      :title="$t('modules.files.files.create-new-folder')"
      :visible="visible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      @open="open"
      @close="close">

      <!-- Content -->
      <el-form
        ref="createForm"
        :model="objectCopy"
        :rules="rules"
        label-position="top"
        @submit.native.prevent="ok">

        <el-form-item
          :label="$t('message.modules-files-objects-create-folder')"
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
      this.objectCopy = {
        kind: 'folder',
        parent: this.objectId,
        name: ''
      }

      this.$nextTick(() => this.$refs.input.select())
    },

    async action () {
      await this.$refs.createForm.validate()

      this.loading = true
      await this.$store.dispatch('modules/files/CreateObject', this.objectCopy)
      this.loading = false
    }
  }
}
</script>
