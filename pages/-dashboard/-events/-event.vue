<template lang="html">
  <div
    :class="{'--is-private': isPrivate, '--is-restricted': isRestricted}"
    class="dashboard--event">

    <div class="dashboard--event-meta">
      <el-tag :type="tagType">
        {{ event.updated_at | moment("from") }}
      </el-tag>
      <span class="dashboard--event-meta-line"/>
    </div>

    <div class="dashboard--event-content">
      <component
        :is="componentLoader"
        :event="event"/>
    </div>

  </div>
</template>

<script type="text/babel">
import _ from 'lodash'
import events from './events.js'

export default {

  components: events,
  props: {
    event: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },

  computed: {
    componentLoader () {
      let source = this.event.source.split('-').map(s => _.upperFirst(s)).join('')
      let type = _.upperFirst(this.event.type)

      return `${source}__${type}`
    },

    isPrivate () {
      return this.event.scope === 'private'
    },

    isRestricted () {
      return this.event.scope === 'restricted'
    },

    tagType () {
      if (this.isPrivate) return ''
      if (this.isRestricted) return ''
      return 'info'
    }
  }
}
</script>
