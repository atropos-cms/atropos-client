<template lang="html">
  <event-component
    :event="event"
    not-deletable>
    <!-- Content -->
    <i class="material-icons text-regular">lock</i>
    <span>{{ $t('events.auth.new-password') }}</span>

  </event-component>
</template>

<script type="text/babel">
import eventMixin from '../eventMixin.js'

export default {
  mixins: [eventMixin],

  props: {
    event: {
      type: Object,
      require: true,
      default: () => ({})
    }
  }
}
</script>
