import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { VueSpinnersPlugin } from 'vue3-spinners'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueSpinnersPlugin)

app.mount('#app')
