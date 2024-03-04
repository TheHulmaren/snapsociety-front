import './assets/output.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './infra/vuex';

import { setTokenInterceptors } from './infra/setup';

import CKEditor from '@ckeditor/ckeditor5-vue';

setTokenInterceptors();

const app = createApp(App)

app.use(router)
app.use(CKEditor)
app.use(store)

app.mount('#app')
