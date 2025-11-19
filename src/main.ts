import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import App from './App.vue';
import router from './router';
import { useAppStore, useUserStore } from './stores';

const app = createApp(App);
const pinia = createPinia();

// Registrar plugins
app.use(pinia);
app.use(router);
app.use(ElementPlus);

// Registrar iconos de Element Plus
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// Inicializar stores
const appStore = useAppStore();
const userStore = useUserStore();

appStore.initialize();
userStore.restoreSession();

app.mount('#app');
