<template>
  <h1>💖 Hello World!</h1>
  <p>Welcome to your Electron application appp 2.</p>
</template>

<script>
import "@/common/TDPrototype.js";
export default {
  created() {
    let me = this;
    console.log("App is running success: " + new Date());
    me.processWhenRunApp();
  },
  methods: {
    /**
     * Xử lý 1 số kịch bản khi khởi chạy ứng dụng
     */
    processWhenRunApp() {
      let me = this;
      let currentTheme = me.$tdCache.get(me.$tdEnum.cacheConfig.theme);
      if (!currentTheme) {
        currentTheme = window.__env.defaultValue.theme;
        me.$tdCache.set(me.$tdEnum.cacheConfig.theme, currentTheme);
      }
      document.body.setAttribute("data-theme", currentTheme);
    },
  },
};
</script>
<style lang="scss">
@import "@/styles/main.scss";
</style>
