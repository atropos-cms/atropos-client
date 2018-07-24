<template lang="html">
  <div>

    <permission-group name="default">

      <permission-toggle
        v-model="role.permissions"
        toggle="login"/>

      <permission-toggle
        v-model="role.permissions"
        toggle="profile"/>

      <permission-toggle
        v-model="role.permissions"
        toggle="events"/>

      <permission-toggle
        v-model="role.permissions"
        required-by="modules-blog-articles, modules-content-blocks, modules-content-galleries"
        toggle="modules-media-browser"/>

    </permission-group>

    <permission-group name="modules">

      <permission-toggle
        v-model="role.permissions"
        requires="modules-media-browser"
        toggle="modules-blog-articles"/>

      <permission-toggle
        v-model="role.permissions"
        toggle="modules-blog-categories"/>

      <permission-toggle
        v-model="role.permissions"
        requires="modules-media-browser"
        toggle="modules-content-blocks"/>

      <permission-toggle
        v-model="role.permissions"
        requires="modules-media-browser"
        toggle="modules-content-galleries"/>

      <permission-toggle
        v-model="role.permissions"
        required-by="modules-files-teams"
        toggle="modules-files-objects"/>
      <permission-toggle
        v-model="role.permissions"
        requires="modules-files-objects"
        toggle="modules-files-teams"/>

      <permission-toggle
        v-model="role.permissions"
        requireds="modules-media-browser"
        toggle="modules-media-files"/>

      <permission-toggle
        v-model="role.permissions"
        required-by="modules-mails-lists"
        toggle="modules-mails-send"/>
      <permission-toggle
        v-model="role.permissions"
        requires="modules-mails-send"
        toggle="modules-mails-lists"/>

    </permission-group>

    <permission-group name="administration">

      <permission-toggle
        v-model="role.permissions"
        toggle="administration-settings"/>

      <permission-toggle
        v-model="role.permissions"
        toggle="administration-users"/>

      <permission-toggle
        v-model="role.permissions"
        toggle="administration-roles"/>

    </permission-group>

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
import saveInTransaction from '~/mixins/saveInTransaction'
import permissionGroup from '~/components/administration/roles/permissionGroup'
import permissionToggle from '~/components/administration/roles/permissionToggle'

export default {
  components: {
    permissionGroup,
    permissionToggle
  },

  mixins: [
    saveInTransaction
  ],

  props: {
    storeRole: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      role: _.cloneDeep(this.storeRole)
    }
  },

  methods: {
    async setRole () {
      this.role = _.cloneDeep(await this.$store.getters['administration/roles/get'](this.$route.params.id))
    },

    async save () {
      await this.saveInTransaction(
        () => this.$store.dispatch('administration/roles/UpdateRole', this.role)
      )
      this.setRole()
    },

    cancel () {
      this.setRole()
    }
  }
}
</script>
