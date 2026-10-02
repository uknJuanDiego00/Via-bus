import { createApp } from 'vue'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import quasarLang from 'quasar/lang/es'

// Material Icons de Quasar (sin emojis)
import '@quasar/extras/material-icons/material-icons.css'

// Estilos Quasar
import 'quasar/dist/quasar.css'

// Pinia y pinia-plugin-persistedstate
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import router from './router'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading
  },
  lang: quasarLang
})

app.mount('#app')
