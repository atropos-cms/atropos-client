<template lang="html">
  <div
    :class="{ 'is-large': large }"
    class="logo">
    <transition
      name="slow-fade"
      @after-leave="enableBrandingIcon">

      <!-- Atropos Logo -->
      <div
        v-if="showAtroposLogo && !showBrandingLogo"
        class="atropos-logo--wrapper">
        <transition name="border-fade">
          <div
            v-if="icon"
            class="logo--icon">
            <span>A</span>
          </div>
        </transition>

        <transition name="slide-fade">
          <div
            v-if="text"
            class="logo-text">
            <span class="logo--text --is-initial">A</span>
            <span class="logo--text --is-not-initial">tropos</span>
          </div>
        </transition>
      </div>

    </transition>
    <transition name="slow-fade">

      <!-- Brand Logo -->
      <div v-if="showBrandingLogo">
        <transition name="slide-fade">
          <div
            v-if="!text"
            :style="{color: branding_color}"
            class="branding--icon">
            <span>{{ branding_abbreviation }}</span>
          </div>

          <div
            v-if="text"
            :style="{color: branding_color}"
            class="branding-text">
            <span>{{ branding_name }}</span>
          </div>
        </transition>
      </div>

    </transition>
  </div>
</template>

<script type="text/babel">
export default {
  props: {
    large: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: true
    },
    icon: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      showText: false,
      showAtroposLogo: true
    }
  },

  computed: {
    branding_abbreviation () {
      return this.$store.getters['administration/settings/get']('branding_abbreviation')
    },
    branding_name () {
      return this.$store.getters['administration/settings/get']('branding_name')
    },
    branding_color () {
      return this.$store.getters['administration/settings/get']('branding_color')
    },
    showBrandingLogo () {
      return this.$store.getters['ui/showBrandingLogo']
    }
  },

  watch: {
    branding_name () {
      this.transitionLogo()
    }
  },

  async mounted () {
    this.transitionLogo()
  },

  methods: {
    async transitionLogo () {
      if (process.server || this.showBrandingLogo || !this.branding_name) return

      await this.$timeout(3000)
      this.showAtroposLogo = false
    },
    async enableBrandingIcon () {
      this.$store.commit('ui/SET_BRANDING_LOGO', true)

      if (process.server) return
      document.title = this.branding_name
    }
  }
}
</script>
