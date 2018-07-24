import Vue from 'vue'
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module'
import VueQuillEditor from 'vue-quill-editor/dist/ssr'

Quill.register('modules/ImageResize', ImageResize)

/* Patch to allow images to have an inline style */
let BaseImageFormat = Quill.import('formats/image')
const ImageFormatAttributesList = [
  'alt',
  'height',
  'width',
  'style'
]

class ImageFormat extends BaseImageFormat {
  static formats (domNode) {
    return ImageFormatAttributesList.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }
  format (name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }
}

Quill.register(ImageFormat, true)

/* Load Plugin */
Vue.use(VueQuillEditor)
