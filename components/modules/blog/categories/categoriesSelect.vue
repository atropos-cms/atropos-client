<template lang="html">
  <el-select
    :value="valueCategory"
    placeholder=""
    filterable
    multiple
    @change="change">
    <el-option
      v-for="category in categories"
      :key="category.id"
      :label="category.title"
      :value="category.id"/>
  </el-select>
</template>

<script type="text/babel">
export default {
  props: {
    value: {
      type: Array,
      require: true,
      default () {
        return []
      }
    }
  },

  computed: {
    categories () {
      return this.$store.getters['modules/blog/categories/list']
    },
    valueCategory () {
      return this.value.map(c => c.id || c)
    }
  },

  mounted () {
    this.$store.dispatch('modules/blog/categories/GetCategories')
  },

  methods: {
    change (value) {
      this.$emit('input', value)
    }
  }
}
</script>
