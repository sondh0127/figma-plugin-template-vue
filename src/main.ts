import 'virtual:svg-icons-register'
import { createApp } from 'vue';
import App from './App.vue';
import './assets/style/index.scss'
import { setup} from '@twind/cdn'

setup({
  preflight: false
})

const app = createApp(App)

app.mount('#app');
