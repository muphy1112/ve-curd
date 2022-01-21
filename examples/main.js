<!--
 * @Author: ruphy若非
 * @Date: 2022-01-20 11:03:21
 * @Description: curd
-->
import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "dayjs/locale/zh-cn";
import VeCurd from "../packages/index"

const app = createApp(App);
app.use(ElementPlus, {locale: zhCn});
app.use(VeCurd)
app.mount('#app')
