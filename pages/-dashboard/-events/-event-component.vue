<template lang="html">
  <el-card
    :class="{'no-content': !showHeader}"
    shadow="never">

    <template
      v-if="showHeader"
      slot="header">
      <div class="dashboard--event-header">

        <!-- Event Name -->
        <div class="dashboard--event-header-name">
          <slot name="event-name"/>
        </div>

        <!-- Delete event -->
        <el-popover
          v-if="showDelete"
          v-model="showPopup"
          placement="top">
          <p>{{ $t('dashboard.events.delete-events') }}</p>
          <div style="text-align: right; margin: 0">
            <el-button
              size="mini"
              type="text"
              @click="closePopup">{{ $t('general.cancel') }}</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteEvent">{{ $t('general.delete') }}</el-button>
          </div>

          <i
            slot="reference"
            class="material-icons text-secondary --has-pointer-cursor"
            style="font-size: 0.8em">
            close
          </i>
        </el-popover>
      </div>

    </template>

    <slot/>

  </el-card>
</template>

<script type="text/babel">
export default {
  props: {
    event: {
      type: Object,
      require: true,
      default: () => ({})
    },
    notDeletable: {
      type: Boolean,
      require: false,
      default: false
    }
  },

  data () {
    return {
      showPopup: false
    }
  },

  computed: {
    profile () {
      return this.$store.getters['profile/profile']
    },
    showHeader () {
      return !!this.$slots['event-name']
    },
    showDelete () {
      if (this.notDeletable) return false
      return this.$can('administration-settings') || this.event.owner_id === this.profile.id
    }
  },

  methods: {
    closePopup () {
      this.showPopup = false
    },
    async deleteEvent () {
      await this.$store.dispatch('administration/events/DeleteEvent', this.event)
      this.closePopup()
    }
  }
}
</script>
