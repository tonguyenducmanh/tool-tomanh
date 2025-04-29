import { createApp } from "vue";
import App from "@/App.vue";
import cache from "@/common/TDCache.js";
import enumeration from "@/common/TDEnum.js";
import router from "./router";
import TDButton from "@/components/TDButton.vue";
import TDTextarea from "@/components/TDTextarea.vue";
import TDInput from "@/components/TDInput.vue";

const currentApp = createApp(App);

// add 1 vài global object
currentApp.config.globalProperties.$tdCache = cache;
currentApp.config.globalProperties.$tdEnum = enumeration;

// add 1 vài component global
currentApp.component("TDButton", TDButton);
currentApp.component("TDTextarea", TDTextarea);
currentApp.component("TDInput", TDInput);

currentApp.use(router);

currentApp.mount("#app");
