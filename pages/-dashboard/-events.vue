<template lang="html">
  <el-card
    :class="{'is-loading': loading}"
    class="box-card dashboard--events">

    <div
      slot="header"
      class="clearfix">
      <h3>{{ $t('dashboard.events.events') }}</h3>
    </div>

    <div
      v-if="loading"
      class="text-secondary --flex-justify-center">
      {{ $t('dashboard.events.loading-events') }}
    </div>
    <div
      :class="{'dashboard--events-loading': loading}">

      <transition-group
        name="el-fade-in"
        tag="div">

        <event
          v-for="event in events"
          :key="event.id"
          :event="event"/>

      </transition-group>

      <transition name="el-fade-in">
        <div
          v-if="!events.length && !loading"
          class="text-secondary --flex-justify-center">
          <span>{{ $t('dashboard.events.no-events') }}</span>
        </div>
      </transition>

    </div>

  </el-card>
</template>

<script type="text/babel">
import Event from './-events/-event'

export default {
  components: {
    Event
  },

  computed: {
    loading () {
      return !this.$store.getters['administration/events/loaded']
    },
    events () {
      return this.$store.getters['administration/events/list']
    }
  },

  async mounted () {
    await this.$timeout(1800)
    await this.$store.dispatch('administration/events/GetEvents')
  }
}
</script>
