import { createApp } from 'vue';
import App from './App.vue';
import './assets/style/index.scss'
import { setup} from '@twind/cdn'

setup({
})

const app = createApp(App)

app.mount('#app');
