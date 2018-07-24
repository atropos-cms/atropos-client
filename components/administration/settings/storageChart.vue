<template lang="html">
  <div>

    <div
      class="text-secondary"
      style="margin-bottom: 0.5em;">
      {{ $t('help.administration.settings.stats-storage', {space: totalStorage}) }}
    </div>

    <div
      class="el-progress-bar__outer"
      style="height: 18px;">

      <div
        :style="{
          'width': `${filesPercentage}%`,
          'left': 0
        }"
        class="el-progress-bar__inner administration-settings-stats-storage--progressbar --progressbar-1">
        <div
          v-if="filesPercentage > 10"
          class="el-progress-bar__innerText">
          {{ value.filesTeams || 0 | filesize }}
        </div>
      </div>

      <div
        :style="{
          'width': `${mediaPercentage}%`,
          'left': `${filesPercentage}%`
        }"
        class="el-progress-bar__inner administration-settings-stats-storage--progressbar --progressbar-2">
        <div
          v-if="mediaPercentage > 10"
          class="el-progress-bar__innerText">
          {{ value.mediaFiles || 0 | filesize }}
        </div>
      </div>
    </div>

    <div class="administration-settings-stats-storage--progressbar-legend">
      <el-tag>{{ $t('modules.files.files.files') }}</el-tag>
      <el-tag type="success">{{ $t('modules.media.browser.media') }}</el-tag>
    </div>

    <div class="help-text">
      {{ $t('help.administration.settings.stats-storage-update-infrequent') }}
      <template v-if="value.updated_at">
        {{ $t('help.administration.settings.last-update', {date: updatedAt}) }}
      </template>
    </div>

  </div>
</template>

<script type="text/babel">
export default {
  props: {
    value: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },

  computed: {
    total () {
      return this.value.totalStorage
    },
    totalStorage () {
      let totalStorage = this.value.totalStorage || 0
      return this.$options.filters.filesize(totalStorage)
    },
    filesPercentage () {
      return Math.round(100 / this.total * this.value.filesTeams)
    },
    mediaPercentage () {
      return Math.round(100 / this.total * this.value.mediaFiles)
    },
    updatedAt () {
      return this.$options.filters.moment(this.value.updated_at, 'from')
    }
  }
}
</script>
