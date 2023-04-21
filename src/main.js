import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'


const vuetify = createVuetify({
  components,
  directives,
})

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
