import './assets/output.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'

import { setTokenInterceptors } from './infra/setup';

import CKEditor from '@ckeditor/ckeditor5-vue';

setTokenInterceptors();

const app = createApp(App)

app.use(router)
app.use(CKEditor)

app.mount('#app')
