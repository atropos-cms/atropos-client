<template lang="html">
  <div
    :class="{'--has-min-height': hasMinHeight}"
    :id="containerId"
    class="quill-editor">
    <div
      v-quill:atroposEditor="editorOption"
      :content="value"
      :disabled="disabled"
      @change="input"/>

    <!-- Quill Localization -->
    <style>
      .ql-snow .ql-picker.ql-size .ql-picker-label::before, .ql-snow .ql-picker.ql-size .ql-picker-item::before {
      content: '{{ $t('editor.sizes.normal') }}';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
      content: '{{ $t('editor.sizes.small') }}';
      }
      .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before, .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
      content: '{{ $t('editor.sizes.large') }}';
      }
    </style>
  </div>
</template>

<script type="text/babel">
export default {
  props: {
    value: {
      type: String,
      require: true,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hasMinHeight: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      require: false,
      default: ''
    }
  },
  data () {
    let containerId = `quill-editor--${this.$generateUID()}`

    return {
      containerId,
      editorOption: {
        placeholder: this.placeholder,
        bounds: `#${containerId}`,
        modules: {
          toolbar: {
            container: [
              [{ 'size': ['small', false, 'large'] }],
              ['bold', 'italic'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              this.$can('modules-media-browser') ? ['link', 'image'] : ['link']
            ],
            handlers: { image: this.handlerForImage }
          },
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          ImageResize: {}
        }
      }
    }
  },

  mounted () {
    this.atroposEditor.history.clear()
  },

  methods: {
    input (event) {
      this.$emit('input', event)
    },
    async handlerForImage (event) {
      const range = this.atroposEditor.getSelection(true)

      this.atroposEditor.enable(false)

      try {
        let file = await this.$mediaBrowser()

        this.atroposEditor.enable(true)

        this.atroposEditor.editor.insertEmbed(range.index, 'image', file.r[2400] || file.download_url)
        this.atroposEditor.setSelection(range.index + 1, 'silent')
      } catch (e) {
        this.atroposEditor.enable(true)
      }

      let html = this.atroposEditor.container.querySelector('.ql-editor').innerHTML
      this.$emit('input', {html})
    }
  }
}
</script>
