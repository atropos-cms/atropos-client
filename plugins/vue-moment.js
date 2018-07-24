import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/de'
import vueMoment from 'vue-moment'

Vue.use(vueMoment, {
  moment
})

export default ({ app, store }) => {
  moment.locale(process.env.LANG)
}
