import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'

import vuetify from './plugins/vuetify'



import { VueSpinnersPlugin } from 'vue3-spinners'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueSpinnersPlugin)
app.use(vuetify) // Use the Vuetify plugin


app.mount('#app')
