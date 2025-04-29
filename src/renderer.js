import { createApp } from "vue";
import App from "@/App.vue";
import cache from "@/common/TDCache.js";
import enumeration from "@/common/TDEnum.js";
import router from "./router";

const currentApp = createApp(App);

// add 1 vài global object
currentApp.config.globalProperties.$tdCache = cache;
currentApp.config.globalProperties.$tdEnum = enumeration;

currentApp.use(router);

currentApp.mount("#app");
