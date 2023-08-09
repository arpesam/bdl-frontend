import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@vuepic/vue-datepicker/dist/main.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { vMaska } from "maska"

const vuetify = createVuetify({
  components,
  directives,
})

import App from './App.vue'
import router from './router'

import './assets/main.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(vuetify)
app.directive("maska", vMaska)


app.mount('#app')
