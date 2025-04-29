import { createApp } from "vue";
import App from "@/App.vue";
import cache from "@/common/TDCache.js";
import enumeration from "@/common/TDEnum.js";

const currentApp = createApp(App);

currentApp.config.globalProperties.$tdCache = cache;
currentApp.config.globalProperties.$tdEnum = enumeration;

currentApp.mount("#app");
