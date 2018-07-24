<template lang="html">
  <el-select
    :multiple="multiple"
    :value="valueRole"
    placeholder=""
    filterable
    @change="change">

    <el-option
      v-for="role in roles"
      :label="role.name"
      :key="role.id"
      :value="role.id"
      :disabled="isDisabled(role.id)"/>

  </el-select>
</template>

<script type="text/babel">
export default {
  props: {
    value: {
      type: [String, Array],
      require: true,
      default: null
    },
    disabledRoles: {
      type: Array,
      require: true,
      default () {
        return []
      }
    },
    multiple: {
      type: Boolean,
      require: false,
      default: false
    }
  },

  computed: {
    roles () {
      return this.$store.getters['administration/roles/list']
    },
    valueRole () {
      if (!this.multiple) return this.value

      return this.value.slice(0).sort((a, b) => {
        // find the role in the roles list
        let roleA = this.roles.find(u => u.id === a)
        let roleB = this.roles.find(u => u.id === b)

        // if one of the roles could not be found, return without sorting
        if (!roleA || !roleB) return 0

        // get the roles name
        var nameA = roleA.name.toUpperCase()
        var nameB = roleB.name.toUpperCase()

        // compare names and return sort order
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
    }
  },

  async mounted () {
    await this.$store.dispatch('administration/roles/GetRoles')
  },

  methods: {
    change (value) {
      this.$emit('input', value)
    },
    isDisabled (roleId) {
      return this.disabledRoles.map(r => r.id || r).includes(roleId)
    }
  }
}
</script>
