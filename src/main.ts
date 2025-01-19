import './assets/global.css'

import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue)

app.mount('#app')
