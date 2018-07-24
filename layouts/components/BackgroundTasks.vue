<template lang="html">
  <transition name="el-notification-fade">
    <div
      v-if="visible"
      :style="{
        'bottom': '16px',
        'z-index': 3000
      }"
      class="el-notification left backgroundtask-notification"
      role="alert"
    >
      <div class="el-notification__group">

        <h2 class="el-notification__title">
          {{ $t(`background-task.${title}`) }}
        </h2>

        <div class="el-notification__content">
          <el-row
            v-for="task in backgorundTasks"
            :key="task.id"
            :gutter="20"
            align="middle"
            type="flex"
            class="backgroundtask-notification--row">

            <el-col
              :span="4"
              class="backgroundtask-notification--progress">

              <div
                v-if="task.progress === undefined"
                class="el-loading-spinner backgroundtask-notification--loading-icon">
                <svg
                  viewBox="25 25 50 50"
                  class="circular">
                  <circle
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    class="path"/>
                </svg>
              </div>

              <i
                v-else-if="task.progress === 100"
                class="material-icons text-secondary">
                check_circle
              </i>

              <el-progress
                v-else
                :percentage="task.progress"
                :width="24"
                :stroke-width="2"
                :show-text="false"
                type="circle"/>

            </el-col>

            <el-col
              :span="20"
              class="backgroundtask-notification--text">
              {{ $t(`background-task.${task.name}`, task.params) }}
            </el-col>

          </el-row>

        </div>

      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
export default {
  computed: {
    backgorundTasks () {
      return this.$store.getters['ui/backgroundTasks']
    },
    visible () {
      return this.$store.getters['ui/hasBackgroundTasks']
    },
    title () {
      return this.backgorundTasks.reduce((carry, task) => {
        if (!carry) return task.type
        if (carry === task.type) return carry
        return 'background-task'
      }, null)
    }
  },

  methods: {
    destroyElement () {
      this.$el.removeEventListener('transitionend', this.destroyElement)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    close () {
      this.visible = false
      this.$el.addEventListener('transitionend', this.destroyElement)
    }
  }
}
</script>
