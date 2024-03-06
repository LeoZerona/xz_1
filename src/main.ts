import { createApp } from "vue";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './globalStyle.css'
import './resert.css'
import App from "./App.vue";
//ant-design-vue
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';

// pinia
import { createPinia } from 'pinia'
//routes
import router from "./rouotes/index";

const app = createApp(App);
const pinia = createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//routes
app.use(router);
app.use(pinia);

app.mount("#app");
