<template lang="html">
  <el-select
    :multiple="multiple"
    :value="valueUser"
    placeholder=""
    filterable
    @change="change">

    <el-option
      v-for="user in users"
      :label="user.full_name"
      :key="user.id"
      :value="user.id"
      :disabled="isDisabled(user.id)"/>

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
    disabledUsers: {
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
    users () {
      return this.$store.getters['administration/users/list']
    },
    valueUser () {
      if (!this.multiple) return this.value
      if (!this.value) return []

      return this.value.slice(0).sort((a, b) => {
        // find the user in the users list
        let userA = this.users.find(u => u.id === a)
        let userB = this.users.find(u => u.id === b)

        // if one of the users could not be found, return without sorting
        if (!userA || !userB) return 0

        // get the users name
        var nameA = userA.full_name.toUpperCase()
        var nameB = userB.full_name.toUpperCase()

        // compare names and return sort order
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        return 0
      })
    }
  },

  async mounted () {
    await this.$store.dispatch('administration/users/GetUsers')
  },

  methods: {
    change (value) {
      this.$emit('input', value)
    },
    isDisabled (userId) {
      return this.disabledUsers.map(u => u.id || u).includes(userId)
    }
  }
}
</script>
