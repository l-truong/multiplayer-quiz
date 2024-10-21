import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n';
import './assets/styles/reset.css'
import './assets/styles/bootstrap.min.css'
import './assets/styles/main.scss'

const app = createApp(App);
app.use(router);
app.use(i18n); 
app.mount('#app');