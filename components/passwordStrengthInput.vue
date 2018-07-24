<template lang="html">
  <div class="password-strength-input">
    <el-input
      ref="input"
      :value="value"
      :placeholder="placeholder"
      type="password"
      auto-complete="off"
      @input="input"/>

    <el-collapse-transition>
      <el-progress
        v-if="showStrength"
        :show-text="false"
        :status="progressStatus"
        :percentage="percentage"/>
    </el-collapse-transition>
  </div>
</template>

<script type="text/babel">
const zxcvbn = import('zxcvbn')

const passwordStrength = async (...args) => {
  return (await zxcvbn).default(...args)
}

export default {
  props: {
    value: {
      type: String,
      require: true,
      default: null
    },

    placeholder: {
      type: String,
      require: true,
      default: null
    },

    userInputs: {
      type: [Array, Object],
      default: () => ([])
    }
  },

  data () {
    return {
      strength: {},
      showStrength: false
    }
  },

  computed: {
    percentage () {
      if (!this.strength) return 0
      return 100 / 4 * this.strength.score
    },
    progressStatus () {
      if (this.percentage < 50) return 'exception'
      if (this.percentage >= 70) return 'success'
      return null
    },
    additionalInfo () {
      if (!this.userInputs) return []
      if (Array.isArray(this.userInputs)) return this.userInputs
      return Object.values(this.userInputs)
    }
  },

  watch: {
    async userInputs () {
      this.strength = this.value === null ? 0 : await passwordStrength(this.value, this.additionalInfo)
    },
    async value () {
      if (this.value) return
      // if the value was reset to null, hide indicator
      this.strength = 0
      this.showStrength = false
    }
  },

  async mounted () {
    // If a password exists on mount, get the strength from zxcvbn.
    if (this.value) {
      this.strength = await passwordStrength(this.value, this.additionalInfo)
    }
  },

  methods: {
    async input (value) {
      this.$emit('input', value)

      this.strength = await passwordStrength(value)
      this.showStrength = true

      this.$emit('strength', this.strength.score)
    },
    focus () {
      this.$refs.input.focus()
    }
  }
}
</script>
