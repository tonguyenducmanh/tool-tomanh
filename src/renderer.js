import { createApp } from "vue";
import App from "@/App.vue";
import cache from "@/common/cache/TDCache.js";
import enumeration from "@/common/TDEnum.js";
import utility from "@/common/TDUtility.js";
import router from "@/router/router.js";
import TDButton from "@/components/TDButton.vue";
import TDTextarea from "@/components/TDTextarea.vue";
import TDInput from "@/components/TDInput.vue";
import TDCheckbox from "@/components/TDCheckbox.vue";
import TDUpload from "@/components/TDUpload.vue";
import TDRadio from "@/components/TDRadio.vue";
import TDRadioGroup from "@/components/TDRadioGroup.vue";
import TDHistory from "@/components/TDHistory.vue";
import i18nData, { loadLocale } from "@/i18n/i18nData.js";

// Async IIFE
(async () => {
  const currentApp = createApp(App);

  // add 1 vài global object
  currentApp.config.globalProperties.$tdCache = cache;
  currentApp.config.globalProperties.$tdEnum = enumeration;
  currentApp.config.globalProperties.$tdUtility = utility;

  // add 1 vài component global
  currentApp.component("TDButton", TDButton);
  currentApp.component("TDTextarea", TDTextarea);
  currentApp.component("TDInput", TDInput);
  currentApp.component("TDCheckbox", TDCheckbox);
  currentApp.component("TDUpload", TDUpload);
  currentApp.component("TDRadio", TDRadio);
  currentApp.component("TDRadioGroup", TDRadioGroup);
  currentApp.component("TDHistory", TDHistory);

  // router link
  currentApp.use(router);

  // globalization language
  currentApp.use(i18nData);

  // Lấy ngôn ngữ hiện tại
  let currentLanguage = await cache.get(enumeration.cacheConfig.Language);
  let locale = currentLanguage ? currentLanguage : enumeration.language.vi;
  await loadLocale(locale);

  currentApp.mount("#app");
})();
