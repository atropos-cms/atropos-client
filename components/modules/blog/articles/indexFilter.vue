<template lang="html">
  <el-collapse-transition>
    <div
      v-if="showFilters"
      class="index-filter-row-wrapper">
      <el-card
        :body-style="{ padding: '10px'}"
        shadow="always"
        class="index-filter-row">

        <el-form
          :inline="true"
          :model="filterForm">

          <el-form-item :label="$t('general.filters.published')">

            <el-select
              v-model="filterForm.published"
              clearable
              @change="filterChanged">
              <el-option
                v-for="item in publishOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>

          </el-form-item>

          <el-form-item :label="$t('general.filters.title')">
            <el-input
              v-model="filterForm.title"
              :placeholder="$t('general.filters.search')"
              @input="filterChanged">
              <i
                slot="prefix"
                class="material-icons el-input__icon">search</i>
            </el-input>
          </el-form-item>

        </el-form>

      </el-card>
    </div>
  </el-collapse-transition>
</template>

<script type="text/babel">
import togglesPageFilter from '~/mixins/togglesPageFilter'

export default {
  mixins: [togglesPageFilter],

  data () {
    return {
      publishOptions: [
        {
          value: 'draft',
          label: this.$t('general.status.draft')
        },
        {
          value: 'published',
          label: this.$t('general.status.published')
        },
        {
          value: 'scheduled',
          label: this.$t('general.status.scheduled')
        }
      ],

      filterForm: {
        published: null,
        title: null
      }
    }
  },

  computed: {
    filters () {
      return this.$store.getters['modules/blog/articles/filters']
    },
    pagination () {
      return this.$store.getters['modules/blog/articles/pagination']
    }
  },

  mounted () {
    this.filterForm = Object.assign({}, this.filters)
  },

  methods: {
    filterChanged () {
      this.$store.dispatch('modules/blog/articles/UpdatePagination', Object.assign({}, this.pagination, { currentPage: 1 }))
      this.$store.dispatch('modules/blog/articles/UpdateFilters', Object.assign({}, this.filterForm))
    }
  }
}
</script>
