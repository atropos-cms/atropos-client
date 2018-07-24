<template lang="html">
  <div class="roles--permission-toggle-wrapper">

    <el-row :gutter="20">
      <el-col
        :span="10"
        :lg="6"
        :xl="4"
        class="roles--permission-toggle">
        <el-switch
          v-model="isSelected"
          :disabled="hasActiveDependents && isSelected"
          :active-text="toggleText"/>
      </el-col>
      <el-col
        :span="12"
        :lg="16"
        :xl="18"
        class="roles--permission-description">
        <span
          class="text-secondary"
          v-html="permissionDescription"/>

        <div
          v-if="hasRequirements"
          class="text-secondary">
          <small><i>{{ requireText }}</i></small>
        </div>
        <div
          v-if="hasDependents"
          class="text-secondary">
          <small><i>{{ dependentsText }}</i></small>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script type="text/babel">
export default {
  props: {
    requires: {
      type: null,
      require: false,
      default: null
    },
    requiredBy: {
      type: null,
      require: false,
      default: null
    },
    toggle: {
      type: String,
      require: true,
      default: ''
    },
    value: {
      type: Array,
      require: true,
      default () {
        return []
      }
    }
  },

  computed: {
    isSelected: {
      get () {
        return this.value.includes(this.toggle)
      },
      set (value) {
        if (value) {
          return this.$emit('input', [...this.value, ...this.requirements, this.toggle])
        }
        return this.$emit('input', this.value.filter(v => v !== this.toggle))
      }
    },
    toggleText () {
      return this.$t(`permissions.${this.toggle}.name`)
    },
    permissionDescription () {
      return this.$t(`permissions.${this.toggle}.description`)
    },
    requirements () {
      if (Array.isArray(this.requires)) {
        return this.requires
      }

      if (typeof this.requires === 'string') {
        return this.requires.split(',').map(r => r.trim())
      }

      return []
    },
    hasRequirements () {
      return !!this.requires
    },
    requireText () {
      let requireText = this.requirements.map(r => this.$t(`permissions.${r}.name`))

      return this.$t(`administration.roles.requires`) + ': ' + requireText.join(', ')
    },
    dependents () {
      if (Array.isArray(this.requiredBy)) {
        return this.requiredBy
      }

      if (typeof this.requiredBy === 'string') {
        return this.requiredBy.split(',').map(r => r.trim())
      }

      return []
    },
    hasDependents () {
      return !!this.requiredBy
    },
    hasActiveDependents () {
      return this.dependents.some(d => this.value.includes(d))
    },
    dependentsText () {
      let dependentsText = this.dependents.map(d => this.$t(`permissions.${d}.name`))

      return this.$t(`administration.roles.required-by`) + ': ' + dependentsText.join(', ')
    }
  }
}
</script>
